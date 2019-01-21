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
