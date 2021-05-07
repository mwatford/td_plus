export const connect = (name, version) =>
  new Promise((resolve, reject) => {
    const connection = indexedDB.open(name, version)
    let db

    connection.onupgradeneeded = e => {
      db = connection.result
      let store = db.createObjectStore('projects', { keyPath: 'timestamp' })
      store.createIndex('timestamp', 'timestamp', { unique: false })

      resolve({ db })
    }

    connection.onsuccess = e => {
      db = connection.result

      db.onversionchange = () => {
        db.close()
        alert('Database is outdated, please reload the page.')
        reject()
      }

      resolve({ db })
    }

    connection.onerror = e => {
      reject(e)
    }
  })

export const manageProject = (operation, project) =>
  new Promise(async (resolve, reject) => {
    let { db } = await connect('data', 1)
    let transaction = db.transaction('projects', 'readwrite')
    let projects = transaction.objectStore('projects')

    let request

    if (operation === 'add') {
      request = projects.put(project)
    }
    if (operation === 'delete') {
      request = projects.delete(project.timestamp)
    }
    if (operation === 'get') {
      request = projects.getAll()
    }
    if (operation === 'removeAll') {
      request = projects.clear()
    }

    request.onsuccess = e => {
      resolve(request.result)
    }

    request.onerror = e => {
      console.log('Error', request.error)
      reject()
    }
  })
