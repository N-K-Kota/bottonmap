Vue.component("mappage-compo",{
  template:
  `<div id="mappage"><div id="botton">
  <div id="botton_top" v-if="active">
    <span id="alertmess" >{{ alertmessage }}</span>
    <div class="btform" >
      <textarea  cols="11" rows="3" maxlength="25" id="message" class="textarea" placeholder="２5文字まで" v-model="unkmessage"></textarea><br>
      <button  id="bottonbtn" @click="bottonfunc" class="nonline">ボットン</button><br>
      <button  id="goodbtn" v-on:click="addmessbtnfunc"  class="nonline">足すだけ</button>
    </div>
  </div>
     <div id="mypagelist" v-show="seenuser" >
      <li v-for="unk in unkslist" class="rireki" @click="jumpfunc(unk.location)">{{ unk.message }}</li>
     </div>
     <div id="botton_bottom">
     <button id="mylist" @click="displaylist" class="systembtn nonline">{{ list }}</button>
     <button id="logout" @click="logoutfunc" class="systembtn nonline">ログアウト</button>
     </div>
   </div>
   <div id="map"></div><input id="pac-input" class="searchbx" type="text" placeholder="Search Box">
   </div>`,
   data: function(){
     return {
       limitf:0,
       alertmessage:"",
       bottoncount:[],
       unkmessage:"",
       active:true,
       seenuser:false,
       list:"マイリスト"
     }
   },
   props:["database","clpoint","myid","unkslist","mapins","goodmode","unkhash","mposi"],
   methods:{
     displaylist:function(){
       this.active = !this.active;
       this.seenuser = !this.seenuser;
       if(this.seenuser){
        this.list="戻る";
       }else{
         this.list="マイリスト";
       }
     },
     logoutfunc:function(){
      firebase.auth().signOut().then(function() {
  // Sign-out successful.
      }).catch(function(error) {
  // An error happened.
      });
     },
     addmessbtnfunc:function(){
       const p = this.mposi;
       let mkey;
       const vm = this
       Object.keys(vm.unkhash).forEach(function(key){
         if((vm.unkhash[key].location[0] == p.lat()) && (vm.unkhash[key].location[1] == p.lng())){
           mkey = key;
         }
       });
       const message = vm.escapestr(vm.unkmessage);
       firebase.database().ref("addmessages").child(mkey).push({addedmess:message});
     },
     bottonfunc:function(){
      if(this.limitf == 1){
      }else{
       this.bottoncount.push(Date.now());
        var len = this.bottoncount.length;
        if(len > 10){
          if((this.bottoncount[len-1]-this.bottoncount[len-10])<60000){  //1分で１０回以上の投稿
             this.limitf =1;
             this.alertmessage = "ボットン制限中です";
             setTimeout(function(){
               this.limitf = 0;
               this.alertmessage="";
             },60000);
          }
         }

          if(this.clpoint !== null){
             let locat = [this.clpoint.position.lat(),this.clpoint.position.lng()];
             let message = this.escapestr(this.unkmessage);
             let stamp = Date.now();
             let unk = {location:locat,message:message,stamp:stamp};
             this.database.ref("unks").push(unk);
             this.database.ref("users").child(this.myid).push(unk);
          }else{}
         }
      },
        escapestr:function(str){
        str =　str.replace(/&/g,'&amp');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#39;');
        return str;
      },
        jumpfunc:function(locat){
          this.mapins.setCenter({lat:locat[0],lng:locat[1]});
          }
      }   //methos閉じる
});

Vue.component("tab-compo",
{template:`
<div id="tabbar"><span v-if="seen" class="title" id="sitetitle">{{ daimei }}</span>
    　<span id="flexcoord">{{ mycoordinate }}</span>
     <div  class="howto">
      <span id="show-modal" @click="showModal = true" v-if="seen">遊び方</span>
      <!-- use the modal component, pass in the prop -->
      <modal v-if="showModal" @close="showModal = false">
        <!--
          you can use custom content here to overwrite
          default content
        -->
        <h3 slot="header">ボットンマップの遊び方</h3>
        <div slot="body"><p>まずは地図をクリックして座標を決めたらボットンしてスッキリしましょう。</p>
                         <p>いいねボタンを押してからうんちをクリックするといいねをつけられます！</p>
        </div>
        <div slot="footer"><p>個人情報は落とさないでくださいね。</p></div>
      </modal>
     </div>
 </div>
`,
data:function(){
    return {
      showModal:false
    }
  },
props:["daimei","mycoordinate","seen"]
});
Vue.component('modal', {
  template: `<transition name="modal">
              <div class="modal-mask">
                <div class="modal-wrapper">
                  <div class="modal-container">

                    <div class="modal-header">
                      <slot name="header">
                        default header
                      </slot>
                    </div>

                    <div class="modal-body">
                      <slot name="body">
                        default body
                      </slot>
                    </div>
                    <div class="modal-footer">
                      <slot name="footer">
                        default footer
                      </slot>
                      <button class="modal-default-button" @click="$emit('close')">
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
  </transition>`
});

Vue.component("toppage-compo",{
  template:`
  <div id="toppage">
      <div id="main" class="container" v-if="mainview">
       <p class="subtitle">〜７日間で消える匿名メッセージアプリ〜</p>
        <div class="maintop">
          <div class="mainleft">
            <button class="standardbtn m-4 nonline" id="start" @click="topfunc">start</button><br>
            <button class="standardbtn m-2 nonline" id="login" @click="login">twitterlogin</button>
          </div>
          <div class="mainright">
            <p><img class="topimg" src="images/expimg.png" alt="説明"></p>
          </div>
        </div>
        <div class="mainbottom">
          <p>
          <span  class="termsbtn" @click="jumpterms">利用規約</span>
          <a href="https://twitter.com/kontakuto33">管理人アカウント</a>
          </p>
        </div>
      </div>
      <div id="term" class="termspage" v-if="termview"><kiyakucompo></kiyakucompo><button class="standardbtn nonline btm" @click="jumptop">戻る</button>
      </div>
  </div>`,
  methods:{
    topfunc:function(){
      this.$emit("loginevent");
      firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    },
    jumpterms:function(){
      this.termview = true;
      this.mainview =false;
    },
    jumptop:function(){
      this.termview=false;
      this.mainview=true;
    },
    login(){
      var provider = new firebase.auth.TwitterAuthProvider();
      var me = this;
      firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
  // You can use these server side with your app's credentials to access the Twitter API.
  // ...
        me.$emit("loginevent");
    }).catch(function(error) {
  // Handle Errors here.
  // ...
});

    }
  },
  data:function(){
    return{
      termview:false,
      mainview:true
    }
  }
});

Vue.component("kiyakucompo",{
  template:`<div><h2>利用規約</h2>
<p>この利用規約（以下，「本規約」といいます。）は，こんた（以下，「当社」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。</p>

<p><h3>第1条（適用）</h3>
本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>

<p><h3>第2条（利用登録）</h3>
登録希望者が当社の定める方法によって利用登録を申請し，当社がこれを承認することによって，利用登録が完了するものとします。
当社は，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。
（1）利用登録の申請に際して虚偽の事項を届け出た場合
（2）本規約に違反したことがある者からの申請である場合
（3）反社会的勢力等（暴力団，暴力団員，右翼団体，反社会的勢力，その他これに準ずる者を意味します。）である，または資金提供その他を通じて反社会的勢力等の維持，運営もしくは経営に協力もしくは関与する等反社会的勢力との何らかの交流もしくは関与を行っていると当社が判断した場合
（4）その他，当社が利用登録を相当でないと判断した場合</p>
<p><h3>第3条（ユーザーIDおよびパスワードの管理）</h3>
ユーザーは，自己の責任において，本サービスのユーザーIDおよびパスワードを管理するものとします。
ユーザーは，いかなる場合にも，ユーザーIDおよびパスワードを第三者に譲渡または貸与することはできません。当社は，ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には，そのユーザーIDを登録しているユーザー自身による利用とみなします。</p>
<p><h3>第4条（禁止事項）</h3>
ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。

（1）法令または公序良俗に違反する行為
（2）犯罪行為に関連する行為
（3）当社のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為
（4）当社のサービスの運営を妨害するおそれのある行為
（5）他のユーザーに関する個人情報等を収集または蓄積する行為
（6）他のユーザーに成りすます行為
（7）当社のサービスに関連して，反社会的勢力に対して直接または間接に利益を供与する行為
（8）当社，本サービスの他の利用者または第三者の知的財産権，肖像権，プライバシー，名誉その他の権利または利益を侵害する行為
（9）過度に暴力的な表現，露骨な性的表現，人種，国籍，信条，性別，社会的身分，門地等による差別につながる表現，自殺，自傷行為，薬物乱用を誘引または助長する表現，その他反社会的な内容を含み他人に不快感を与える表現を，投稿または送信する行為
（10）営業，宣伝，広告，勧誘，その他営利を目的とする行為（当社の認めたものを除きます。），性行為やわいせつな行為を目的とする行為，面識のない異性との出会いや交際を目的とする行為，他のお客様に対する嫌がらせや誹謗中傷を目的とする行為，その他本サービスが予定している利用目的と異なる目的で本サービスを利用する行為
（11）宗教活動または宗教団体への勧誘行為
（12）その他，当社が不適切と判断する行為</p>
<p><h3>第6条（本サービスの提供の停止等）</h3>
当社は，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
（1）本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
（2）地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合
（3）コンピュータまたは通信回線等が事故により停止した場合
（4）その他，当社が本サービスの提供が困難と判断した場合
当社は，本サービスの提供の停止または中断により，ユーザーまたは第三者が被ったいかなる不利益または損害について，理由を問わず一切の責任を負わないものとします。</p>
<p><h3>第7条（著作権）</h3>
ユーザーは，自ら著作権等の必要な知的財産権を有するか，または必要な権利者の許諾を得た文章，画像や映像等の情報のみ，本サービスを利用し，投稿または編集することができるものとします。
ユーザーが本サービスを利用して投稿または編集した文章，画像，映像等の著作権については，当該ユーザーその他既存の権利者に留保されるものとします。ただし，当社は，本サービスを利用して投稿または編集された文章，画像，映像等を利用できるものとし，ユーザーは，この利用に関して，著作者人格権を行使しないものとします。
前項本文の定めるものを除き，本サービスおよび本サービスに関連する一切の情報についての著作権およびその他知的財産権はすべて当社または当社にその利用を許諾した権利者に帰属し，ユーザーは無断で複製，譲渡，貸与，翻訳，改変，転載，公衆送信（送信可能化を含みます。），伝送，配布，出版，営業使用等をしてはならないものとします。</p>
<p><h3>第8条（利用制限および登録抹消）</h3>
当社は，以下の場合には，事前の通知なく，投稿データを削除し，ユーザーに対して本サービスの全部もしくは一部の利用を制限しまたはユーザーとしての登録を抹消することができるものとします。
（1）本規約のいずれかの条項に違反した場合
（2）登録事項に虚偽の事実があることが判明した場合
（3）破産，民事再生，会社更生または特別清算の手続開始決定等の申立がなされたとき
（4）1年間以上本サービスの利用がない場合
（5）当社からの問い合わせその他の回答を求める連絡に対して30日間以上応答がない場合
（6）第2条第2項各号に該当する場合
（7）その他，当社が本サービスの利用を適当でないと判断した場合
前項各号のいずれかに該当した場合，ユーザーは，当然に当社に対する一切の債務について期限の利益を失い，その時点において負担する一切の債務を直ちに一括して弁済しなければなりません。
当社は，本条に基づき当社が行った行為によりユーザーに生じた損害について，一切の責任を負いません。</p>
<p><h3>第9条（保証の否認および免責事項）</h3>
当社は，本サービスに事実上または法律上の瑕疵（安全性，信頼性，正確性，完全性，有効性，特定の目的への適合性，セキュリティなどに関する欠陥，エラーやバグ，権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
当社は，本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし，本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合，この免責規定は適用されません。
前項ただし書に定める場合であっても，当社は，当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し，または予見し得た場合を含みます。）について一切の責任を負いません。また，当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は，ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。
当社は，本サービスに関して，ユーザーと他のユーザーまたは第三者との間において生じた取引，連絡または紛争等について一切責任を負いません。</p>
<p><h3>第10条（サービス内容の変更等）</h3>
当社は，ユーザーに通知することなく，本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし，これによってユーザーに生じた損害について一切の責任を負いません。</p>

<p><h3>第11条（利用規約の変更）</h3>
当社は，必要と判断した場合には，ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>

<p><h3>第12条（通知または連絡）</h3>
ユーザーと当社との間の通知または連絡は，当社の定める方法によって行うものとします。</p>

<p><h3>第13条（権利義務の譲渡の禁止）</h3>
ユーザーは，当社の書面による事前の承諾なく，利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し，または担保に供することはできません。</p>

<p><h3>第14条（準拠法・裁判管轄）</h3>
本規約の解釈にあたっては，日本法を準拠法とします。
本サービスに関して紛争が生じた場合には，当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</p></div>`
});

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
