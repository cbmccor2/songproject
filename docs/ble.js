
async function connect() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        //optionalServices: [serviceUuid],
        // acceptAllDevices: true,
        filters: [
          { namePrefix: "MM-" },
        ]
      }).catch(error => { console.log(error); });
        
  
  
    
  
  
      console.log('Connected to device : ', device.name);
  
  
  
      // Connect to the GATT server
      // We also get the name of the Bluetooth device here
      let deviceName = device.gatt.device.name;
      const server = await device.gatt.connect();
  
      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
  
      // Enable notifications for the characteristic
      await characteristic.startNotifications();
  
      device_characteristics.push(characteristic);
  
      // Listen for characteristic value changes
      characteristic.addEventListener('characteristicvaluechanged', handleBLEMessage);
      var index = devices.indexOf(device);
      if (index == -1) {
        devices.push(device);
        sendBLEMessage("start", devices.length - 1);
        device.addEventListener('gattserverdisconnected', onDisconnected(index));
      }
      
      connect_aux(index);
  
  
  
  
    } catch (error) {
      console.error('An error occurred while connecting:', error);
    }
  
  }
  


async function connect_aux(index) {
    exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
      async function toTry() {
        time('Connecting to Bluetooth Device... ');
        await devices[index].gatt.connect();
      },
      function success() {
        console.log('> Bluetooth Device connected. Try disconnect it now.');
      },
      function fail() {
        time('Failed to reconnect.');
      });
  }
  
  function onDisconnected(index) {
    console.log('> Bluetooth Device disconnected');
    connect_aux(index);
  }