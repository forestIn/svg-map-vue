(function() {
  var bus;

  Vue.use(VueMaterial);

  bus = new Vue;

  Vue.component('svg-map', {
    template: '<g><region-path v-for="(region, index) in regions" :region="region"> </region-path> </g>',
    props: ['regions'],
    components: {
      'region-path': {
        props: {
          region: Object
        },
        template: '<path :index="region.name" :d="region.path" v-on:click="getInfo" v-on:mouseover="mouseOver" v-on:mouseout="mouseOut" class="state" v-bind:class="{ regionActive: isActive}"/>',
        data: function() {
          return {
            isActive: false
          };
        },
        methods: {
          getInfo: function() {
            bus.$emit('modal', this.region.name);
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
      regions: map_russia.pathes,
      title: "",
      dataRegion: "",
      dataRegions: [],
      showModal: false,
      federal_city: ['г. Севастополь', 'г. Москва']
    },
    created: function() {
      var vm;
      vm = this;
      bus.$on('modal', function(name) {
        vm.dataRegion = vm.dataRegions.filter(function(obj) {
          return obj.region === name;
        });
        if (vm.dataRegion.length > 0) {
          vm.dataRegion = vm.dataRegion[0];
          return vm.$refs['dialog1'].open();
        } else {
          return console.log('Нет данных по ' + name);
        }
      });
      bus.$on('regionName', function(name) {
        return vm.title = name;
      });
      bus.$on('regionNameOut', function() {
        return vm.title = '';
      });
      return axios.get('js/data.json').then(function(response) {
        var density, i, len, ref1, results, x;
        vm.dataRegions = response.data;
        ref1 = vm.dataRegions;
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
          x = ref1[i];
          density = (x.city_population + x.country_population) / x.area;
          results.push(x.density = Math.round(density * 10) / 10);
        }
        return results;
      })["catch"](function(error) {
        return console.log('Ошибка! Не могу связаться с API. ' + error);
      });
    },
    methods: {
      openDialog: function(ref) {
        return this.$refs[ref].open();
      },
      closeDialog: function(ref) {
        return this.$refs[ref].close();
      }
    }
  });

}).call(this);
