import {MouseEventHandler, useRef, useState} from 'react';

const actionStates = {
  LONGPRESS: 'longpress',
  CLICK: 'click',
  NONE: 'none',
};

const LongPressTime = 600; // Time in ms

interface useLongPressProps {
  onLongPress: () => void;
  onPress?: () => void;
}

const useLongPress = ({onLongPress, onPress}: useLongPressProps) => {
  const [action, setAction] = useState<string>();

  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const isLongPress = useRef<boolean | undefined>();

  const startPressTimer = () => {
    isLongPress.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      // console.log('Long press triggered');
      isLongPress.current = true;
      setAction(actionStates.LONGPRESS);
      onLongPress();
    }, LongPressTime);
  };

  const handleOnClick: MouseEventHandler = _e => {
    // console.log('handleOnClick');
    if (isLongPress.current) {
      // console.log('Is long press - not continuing.');
      return;
    }
    setAction(actionStates.CLICK);

    onPress && onPress(); // Execute onPress if it exists
  };

  const handleOnMouseDown = () => {
    // console.log('handleOnMouseDown');
    startPressTimer();
  };

  const handleOnMouseUp = () => {
    // console.log('handleOnMouseUp');
    clearTimeout(timerRef.current);
  };

  const handleOnTouchStart = () => {
    // console.log('handleOnTouchStart');
    startPressTimer();
  };

  const handleOnTouchEnd = () => {
    if (action === actionStates.LONGPRESS) return;
    // console.log('handleOnTouchEnd');
    clearTimeout(timerRef.current);
  };

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
};

export default useLongPress;
