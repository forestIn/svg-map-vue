<template>
  <svg viewBox="0 0 990 560"  xmlns="http://www.w3.org/2000/svg">
    <g>
      <region-path v-for="(value, key) in  regions" :key=key :index="key" :region="value">
      </region-path>
    </g>
  </svg>
</template>

<script>
export default {
  name: "SvgMap",
  data() {
    return {};
    
  },
  props: ["regions"],
  components: {
    "region-path": {
      props: {
        region: Object,
        index: Number
      },
      data: function(){
        return {
           isActive: false
        }
      },
      template: "<path :index='index' :d='region.path' class='state'  @mouseover='isActive = true' @mouseout='isActive = false'"+
                "v-bind:class='{ regionActive: isActive}'/>",
      methods:{

      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>
svg 
  width 100%
  height 100%
svg .state 
  stroke-width: 1
  stroke: #fff
  -webkit-transition: stroke 0.5s, stroke-width 0.5s
  -o-transition: stroke 0.5s, stroke-width 0.5s
  transition: stroke 0.5s, stroke-width 0.5s

svg .state:hover, .state.active 
  cursor: pointer
  stroke-width: 1
  stroke: #000

path 
  fill: #42b983
  opacity: 0.75

.regionActive 
  fill: #42b933
  opacity: 0.75

p 
  margin: 0 0 10px

.close 
  float: right
  font-size: 1.5rem
  font-weight: bold
  line-height: 1
  color: #000
  text-shadow: 0 1px 0 #fff
  opacity: 0.5

.close:focus, .close:hover 
  color: #000
  text-decoration: none
  cursor: pointer
  opacity: 0.75

</style>
