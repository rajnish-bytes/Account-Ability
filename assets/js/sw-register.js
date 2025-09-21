// Service Worker Registration Script

// Check if service workers are supported by the browser
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    // Register the service worker
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (registration) {
        console.log('Service Worker registered with scope:', registration.scope);

        // Set up periodic sync if browser supports it
        if ('periodicSync' in registration) {
          // Try to register periodic sync
          navigator.permissions.query({ name: 'periodic-background-sync' })
            .then((status) => {
              if (status.state === 'granted') {
                registration.periodicSync.register('content-sync', {
                  minInterval: 24 * 60 * 60 * 1000 // Once a day
                }).catch(error => {
                  console.error('Periodic Sync registration failed:', error);
                });
              }
            });
        }
      })
      .catch(function (error) {
        console.error('Service Worker registration failed:', error);
      });
  });

  // Set up offline form submission handling
  document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', async function (event) {
        // Check if we're offline
        if (!navigator.onLine) {
          event.preventDefault();

          // Get form data
          const formData = new FormData(form);
          const formObject = {};

          formData.forEach((value, key) => {
            formObject[key] = value;
          });

          // Add unique ID and timestamp
          formObject.id = Date.now().toString();
          formObject.timestamp = new Date().toISOString();

          try {
            // Store in IndexedDB
            const db = await openDB('account-ability-forms', 1);
            const tx = db.transaction('forms', 'readwrite');
            const store = tx.objectStore('forms');
            await store.add(formObject);
            await tx.complete;

            // Register for sync when back online
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('contact-form-sync');

            alert('You appear to be offline. Your form will be submitted automatically when you reconnect to the internet.');

          } catch (err) {
            console.error('Error saving form data:', err);
            alert('Failed to save your form data for later submission. Please try again when you have an internet connection.');
          }
        }
      });
    });
  });
}

// Helper function to open IndexedDB
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('forms')) {
        db.createObjectStore('forms', { keyPath: 'id' });
      }
    };

    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e.target.error);
  });
}

// Function to show toast notifications for online/offline status
function updateOnlineStatus() {
  const wasOffline = sessionStorage.getItem('wasOffline') === 'true';

  if (navigator.onLine) {
    // Show reconnected message if we were previously offline
    if (wasOffline) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in';
      toast.textContent = 'You are back online!';
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 500);
      }, 3000);

      // Reset offline flag
      sessionStorage.setItem('wasOffline', 'false');
    }
  } else {
    // Store that we're offline now
    sessionStorage.setItem('wasOffline', 'true');

    // Show offline message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in';
    toast.textContent = 'You are offline. Some features may be limited.';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }
}

// Monitor online/offline status
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Check connection status when the page loads
document.addEventListener('DOMContentLoaded', function () {
  // If we're offline when the page loads, show the notification
  if (!navigator.onLine) {
    updateOnlineStatus();
  }
});