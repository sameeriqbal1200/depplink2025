// // Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: "AIzaSyCsEDo_fcfr5B_YDz-TyzhLe0VD__YAsx0",
//   authDomain: "tamkeenstores-reactnative-2023.firebaseapp.com",
//   projectId: "tamkeenstores-reactnative-2023",
//   storageBucket: "tamkeenstores-reactnative-2023.appspot.com",
//   messagingSenderId: "118466558407",
//   appId: "1:118466558407:web:6bb8f2f3b08a0ebb1641e2",
//   measurementId: "G-HWCQXQF7VK"
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   // console.log('Received background message to ', payload);
//   if(localStorage.getItem('globalNotification') == true) {
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//       body: payload.notification.body,
//       icon: payload.notification.image,
//     };

//     self.registration.showNotification(notificationTitle,
//       notificationOptions);
//     // self.addEventListener('notificationclick', function (event) {
//     //   var doge = event.notification.data.doge;
//     //   console.log(doge.wow);
//     // });
//   }
// });
