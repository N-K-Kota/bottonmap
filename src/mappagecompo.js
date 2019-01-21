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
