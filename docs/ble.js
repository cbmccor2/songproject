// UUIDs for the service and characteristic
const serviceUuid = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const characteristicUuid = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

let devices = [];
let device_characteristics = [];




async function connect() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        optionalServices: [serviceUuid],
        // acceptAllDevices: true,
        filters: [
          { namePrefix: "MM-" },
        ]
      }).catch(error => { console.log(error); });
        
  
  
    
  
  
      //console.log('Connected to device : ', device);
  
  
  
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
        //sendBLEMessage("start", devices.length - 1);
        device.addEventListener('gattserverdisconnected', onDisconnected(index));
      }
      
      connect_aux(index);
  
  
  
  
    } catch (error) {
      console.error('An error occurred while connecting:', error);
    }
  
  }
  
  async function exponentialBackoff(max, delay, toTry, success, fail) {
    try {
      const result = await toTry();
      success(result);
    } catch(error) {
      if (max === 0) {
        return fail();
      }
      time('Retrying in ' + delay + 's... (' + max + ' tries left)');
      setTimeout(function() {
        exponentialBackoff(--max, delay * 2, toTry, success, fail);
      }, delay * 1000);
    }
  }
  
  function time(text) {
    console.log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
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

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  


function handleBLEMessage(event) {
  const value = event.target.value;
  const decoder = new TextDecoder('utf-8');
  const message = decoder.decode(value);
  console.log(message);
}


// OG Data Stream Parsing Code
// 
// const accelerometerData = {x:0, y:0, z:0};
//         const audio = document.getElementById('soundBrain');
//         var running = 0;

//         function checkAccel(data){
//             const thresholdX = 5;
//             const thresholdY = 5;
//             const thresholdZ = 5;

//             if(Math.abs(data.x) > thresholdX || 
//                 Math.abs(data.y) > thresholdY ||
//                 Math.abs(data.z) > thresholdZ)
//             {
//                 return 1;
//             }
//             else{
//                 return 0;
//             }
//         }

// document.addEventListener('devicemotion', (event) => {
//     accelerometerData.x = event.accelerationIncludingGravity.x;
//     accelerometerData.y = event.accelerationIncludingGravity.y;
//     accelerometerData.z = event.accelerationIncludingGravity.z;

//     // Call the function to check the threshold
//     if(checkAccel() = 1){
//         audio.pause();
//     }
//     else{
//         console.log('it did not work!');
//     }
// });
const Data(pacNum, gyroX, gyroY, gyroZ, 
  accX, accY, accZ, magX, magY, magZ,
  quatX, quatY, quatZ, quatW, mac){
    

}
