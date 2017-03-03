(function() {
  var bus;

  Vue.use(VueMaterial);

  bus = new Vue;

  Vue.component('svg-map', {
    template: '<g><region-path v-for="(value, key) in  regions" :index="key" :region="value"> </region-path> </g>',
    props: ['regions'],
    components: {
      'region-path': {
        props: {
          region: Object,
          index: Number
        },
        template: '<path :index="index" :d="region.path" v-on:click="getInfo" v-on:mouseover="mouseOver" v-on:mouseout="mouseOut" class="state" v-if="region.show" v-bind:class="{ regionActive: isActive}"/>',
        data: function() {
          return {
            isActive: false
          };
        },
        methods: {
          getInfo: function() {
            bus.$emit('modal', this.index);
          },
          mouseOver: function() {
            bus.$emit('regionName', this.region.name);
            this.isActive = true;
          },
          mouseOut: function() {
            bus.$emit('regionNameOut');
            return this.isActive = false;
          }
        }
      }
    }
  });

  new Vue({
    el: '#app',
    data: {
      title: "",
      regions: "",
      dataRegion: "",
      showModal: false
    },
    created: function() {
      var vm;
      vm = this;
      bus.$on('modal', function(id) {
        vm.dataRegion = vm.regions[id];
        return vm.$refs['dialog1'].open();
      });
      bus.$on('regionName', function(name) {
        return vm.title = name;
      });
      bus.$on('regionNameOut', function() {
        return vm.title = '';
      });
      axios.get('js/data.json').then(function(response) {
        var density, region, regions;
        regions = response.data;
        for (region in regions) {
          regions[region]['show'] = true;
          density = (regions[region].city_population + regions[region].country_population) / regions[region].area;
          regions[region]['density'] = Math.round(density * 10) / 10;
        }
        return vm.regions = regions;
      })["catch"](function(error) {
        return console.log('Ошибка! Не могу связаться с API. ' + error);
      });
    },
    methods: {
      changeVisible: function(name) {
        var region, regions, results;
        regions = this.regions.filter(function(value, index, self) {
          return value.fed_okrug === name;
        });
        results = [];
        for (region in regions) {
          results.push(regions[region].show = !regions[region].show);
        }
        return results;
      },
      openDialog: function(ref) {
        return this.$refs[ref].open();
      },
      closeDialog: function(ref) {
        return this.$refs[ref].close();
      }
    },
    computed: {
      federal_okrug: function() {
        var i, len, okrug, okrugs, okrugs_show, region;
        okrugs_show = [];
        okrugs = (function() {
          var i, len, ref1, results;
          ref1 = this.regions;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            region = ref1[i];
            results.push(region.fed_okrug);
          }
          return results;
        }).call(this);
        okrugs = okrugs.filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });
        for (i = 0, len = okrugs.length; i < len; i++) {
          okrug = okrugs[i];
          okrugs_show.push({
            'name': okrug,
            'show': true
          });
        }
        return okrugs_show;
      }
    }
  });

}).call(this);
