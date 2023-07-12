import db, {ServerTable, EventTable} from './db';

/**
 * Add a server to the IndexedDB if it doesn't already exist
 * @param {ServerTable} server - The server to add
 */
export const addServer = async ({base_url, client_id, scope, auth_token}: ServerTable) => {
  const serverExists = await db.servers.get({base_url: base_url});
  if (!serverExists) {
    // Add the server to IndexedDB
    await db.servers.add({
      base_url: base_url,
      client_id: client_id,
      scope: scope,
      auth_token: auth_token,
    });
  }
};

/**
 * Add an event to the IndexedDB if it doesn't already exist
 * @param {EventTable} event - The event to add
 */
export const addEvent = async ({id, title, date, server_base_url}: EventTable) => {
  const eventExists = await db.events.get({id: id});
  if (!eventExists) {
    await db.events.add({
      id: id,
      title: title,
      date: date,
      server_base_url: server_base_url,
    });
  }
};
