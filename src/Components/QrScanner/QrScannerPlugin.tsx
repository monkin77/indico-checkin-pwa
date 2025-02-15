// file = QrScannerPlugin.jsx
import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats} from 'html5-qrcode';
import {checkCameraPermissions} from '../../utils/media';
import classes from './QrScanner.module.css';

// Id of the HTML element used by the Html5QrcodeScanner.
const qrcodeRegionId = 'html5qr-code-full-region';
export const defaultAspectRatio = {
  desktop: 0.8, // Since the camera orientation is landscape, the aspect ratio is 0.8
  mobile: 1.1, // Since the camera orientation is portrait, the aspect ratio is 1.1
};

/**
 * @returns the aspect ratio of the video feed based on the window size
 */
export const calcAspectRatio = () => {
  // TODO: This is not the ideal way to define the aspect ratio. Could find a way to detect the camera orientation
  if (window.innerWidth < window.innerHeight) {
    return defaultAspectRatio.mobile;
  }
  return defaultAspectRatio.desktop;
};

interface QrProps {
  fps?: number; // Expected frame rate of qr code scanning. example { fps: 2 } means the scanning would be done every 500 ms.
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string, error: any) => void;
  verbose?: boolean;
  formatsToSupport?: Html5QrcodeSupportedFormats[];
  onPermRefused: () => void;
  pause?: boolean;
}

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: QrProps) => {
  // default config values
  let config: {
    fps: number;
    qrbox: number;
    aspectRatio: number;
    disableFlip: boolean;
    formatsToSupport?: Html5QrcodeSupportedFormats[];
    pause?: boolean;
  } = {
    fps: 10,
    qrbox: 250,
    aspectRatio: 1.0,
    disableFlip: false,
    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    pause: false,
  };

  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  if (props.formatsToSupport) {
    config.formatsToSupport = props.formatsToSupport;
  }
  if (props.pause) {
    config.pause = props.pause;
  }

  return config;
};

const QrScannerPlugin = (props: QrProps) => {
  const html5CustomScanner: MutableRefObject<Html5Qrcode | null> = useRef(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const showQRCode = async () => {
      // console.log('showQRCode');

      const hasCamPerm: boolean = await checkCameraPermissions();
      if (!hasCamPerm) {
        // Notify that the permission is refused
        if (props.onPermRefused) {
          props.onPermRefused();
        }
        return;
      }

      const config = createConfig(props);
      const verbose = props.verbose === true;
      // Suceess callback is required.
      if (!props.qrCodeSuccessCallback) {
        console.log('[Error] qrCodeSuccessCallback is required.');
        return;
      }

      // Check if element with given id exists.
      if (!document.getElementById(qrcodeRegionId)) {
        console.log(`[Error] Element with id=${qrcodeRegionId} does not exists.`);
        return;
      }

      const currCamState = html5CustomScanner.current?.getState() || 0;
      // console.log('currCamState: ', currCamState);

      // Handle the pause logic
      if (config.pause && currCamState === Html5QrcodeScannerState.SCANNING) {
        // Try to pause the scanner
        await html5CustomScanner?.current?.pause(true);
        return;
      }
      if (!config.pause && currCamState === Html5QrcodeScannerState.PAUSED) {
        // Try to resume the scanner
        await html5CustomScanner?.current?.resume();
        return;
      }

      if (currCamState <= Html5QrcodeScannerState.UNKNOWN) {
        // when component mounts
        html5CustomScanner.current = new Html5Qrcode(qrcodeRegionId, {
          ...config,
          verbose,
        });
        // console.log('Starting QR Scanner');
        await html5CustomScanner.current.start(
          {facingMode: 'environment'},
          config,
          props.qrCodeSuccessCallback,
          props.qrCodeErrorCallback
        );

        // Show the animation if the aspect ratio is the default
        if (
          props.aspectRatio === defaultAspectRatio.desktop ||
          props.aspectRatio === defaultAspectRatio.mobile
        ) {
          setShowAnimation(true);
        }
      }
    };

    showQRCode();

    // cleanup function when component will unmount
    return () => {
      const stopQrScanner = async () => {
        // console.log('stopQrScanner');
        if (html5CustomScanner.current?.isScanning) {
          await html5CustomScanner.current.stop();
        }
        html5CustomScanner.current?.clear();
        // Destroy the object
        html5CustomScanner.current = null;
      };

      stopQrScanner();
    };
  }, [props]);

  return <div id={qrcodeRegionId} className={showAnimation ? classes.qrRegion : ''} />;
};

export default QrScannerPlugin;
