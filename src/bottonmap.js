// Initialize Firebase


var vueins = new Vue({
el: '#container',
data: {
  mymap:null,
  topseen: true,
  mapseen:false,
  daimei:"ボットンマップ",
  mycoordinate:"",
  unks:[],
  likes:[],
  myunks:[],
  point:null,
  goodmode:false,
  seen:true,
  userid:"",
  mposition:null
},
created:function(){
  var config = {
    apiKey: "AIzaSyASZ5Nij0IFlqwl9eSCb2afJgfB_yIiTnI",
    authDomain: "bottonmap.firebaseapp.com",
    databaseURL: "https://bottonmap.firebaseio.com",
    projectId: "bottonmap",
    storageBucket: "bottonmap.appspot.com",
    messagingSenderId: "1011339138818"
  };
  firebase.initializeApp(config);
},
methods:{
  loginpage:function(){
    this.topseen = false;
    this.mapseen = true;
  },
  logoutpage:function(){
    this.topseen = true;
    this.mapseen = false;
    this.daimei="ボットンマップ";
    this.mycoordinate = "";
    this.seen=true;
  }
},
computed:{
  database:function(){
    return firebase.database();
  }
}
});

firebase.auth().onAuthStateChanged(function(user){
  if (user) {
    // User is signed in.
    vueins.userid=user.uid;
    firebase.database().ref("users").child(user.uid).on("child_added",function(snap){
      vueins.myunks.push(snap.val());
    });
  } else {
    vueins.logoutpage();
    // User is signed out.
    // ...
  }  // ...
});
  // In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.

// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.

function initMap() {
 var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 15,
  center: {lat: 35.68016468234278, lng: 139.75783438291512},
  mapTypeId:'roadmap',
  fullscreenControl:false
});
var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
map.addListener('bounds_changed',function(){
        searchBox.setBounds(map.getBounds());
      });
searchBox.addListener('places_changed',function(){
  var places = searchBox.getPlaces();
  if(places.length == 0){
  return;
}
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place){
    if (place.geometry.viewport) {
        // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
      } else {
            bounds.extend(place.geometry.location);
      }
      if(vueins.point !== null){
        vueins.point.setMap(null);
      }
      vueins.point = new google.maps.Marker({
      position:place.geometry.location,
      map:map,
      animation:google.maps.Animation.BOUNCE
    });
    vueins.mycoordinate = vueins.point.position.lat()+":"+vueins.point.position.lng();
  });
  map.fitBounds(bounds);
});

vueins.database.ref("unks").on("child_added",function(snap){
  var now = Date.now();
  if((now-snap.val().stamp)>604800000){
    vueins.database.ref("unks").child(snap.key).remove();
    delete vueins.unks[snap.key];
    vueins.database.ref("likes").child(snap.key).remove();
    delete vueins.likes[snap.key];
  }else{
  vueins.unks[snap.key]=snap.val();
  var location = new google.maps.LatLng(snap.val().location[0],snap.val().location[1]);
  setMarkers(map,location,snap.val().message);
  }
});

vueins.database.ref("addmessages").on("child_added",function(snap){
  var obj = snap.val();
  var key =  Object.keys(obj);
  console.log(obj[key[0]]);
  var location = new google.maps.LatLng(vueins.unks[snap.key].location[0],vueins.unks[snap.key].location[1]);
  setMarkers(map,location,vueins.unks[snap.key].message+obj[key[0]].addedmess);
});

 map.addListener("click",function(e){
  vueins.mycoordinate = e.latLng.lat()+":"+e.latLng.lng();
  if(window.innerWidth > 620){
   vueins.daimei = "現在地";
  }else{
    vueins.seen = false;
  }
  if(vueins.point !== null){
    vueins.point.setMap(null);
  }
    vueins.point = new google.maps.Marker({
    position:e.latLng,
    map:map,
    animation:google.maps.Animation.BOUNCE
  });
});
vueins.mymap = map;
}   //initmap終了

// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.

function setMarkers(map,location,message) {
// Adds markers to the map.

// Marker sizes are expressed as a Size of X,Y where the origin of the image
// (0,0) is located in the top left of the image.

// Origins, anchor positions and coordinates of the marker increase in the X
// direction to the right and in the Y direction down.

// Shapes define the clickable region of the icon. The type defines an HTML
// <area> element 'poly' which traces out a polygon as a series of X,Y points.
// The final coordinate closes the poly by connecting to the first coordinate.

  let marker = new google.maps.Marker({
    position: location,
    map: map,
    icon:'images/s_unk.png',
    animation:google.maps.Animation.DROP
  });
  let infowindow = new google.maps.InfoWindow({
    content:message.replace(/\n/g,"<br>"),
    disableAutoPan:true
  });
  let wf=true;


  marker.addListener("click",function(e){
    if(wf){
       infowindow.open(map,marker);
       vueins.mposition = this.position;
     wf=false;
   }else{
     infowindow.close();
     wf=true;
   }
   });
}
