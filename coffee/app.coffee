Vue.use(VueMaterial)
bus = new Vue

Vue.component 'svg-map', 
    template: '<g><region-path v-for="(region, index) in regions"
                                :region="region">
                   </region-path>
              </g>',
    props: ['regions']
    components:
        'region-path':
            props:
                region:Object 
            template:'<path :index="region.name"
                            :d="region.path" 
                        v-on:click="getInfo" 
                        v-on:mouseover="mouseOver" 
                        v-on:mouseout="mouseOut" 
                        class="state" 
                        v-bind:class="{ regionActive: isActive}"/>'
            data: ()->
                return { isActive: false }
            methods:
                getInfo: ()->
                    bus.$emit 'modal', @region.name
                    return                     
                mouseOver: ()->
                    bus.$emit 'regionName', @region.name
                    @isActive=true
                    return
                mouseOut: ()->
                    bus.$emit 'regionNameOut'
                    @isActive=false


new Vue
    el: '#app'
    data: 
        regions:map_russia.pathes
        title:""
        dataRegion:""
        dataRegions:[]
        showModal:false
        federal_city:['г. Севастополь', 'г. Москва']
    created: ()->
        vm = @
        bus.$on 'modal', (name)->
            vm.dataRegion = vm.dataRegions.filter (obj)->
                                obj.region==name
            if vm.dataRegion.length>0
                vm.dataRegion = vm.dataRegion[0]
                vm.$refs['dialog1'].open() 
            else
                console.log 'Нет данных по '+name

        bus.$on 'regionName', (name)->
            vm.title = name
        bus.$on 'regionNameOut', ()->
            vm.title = ''            

        axios.get('js/data.json')
            .then (response)->
                vm.dataRegions = response.data
                for x in vm.dataRegions
                    density = (x.city_population+x.country_population)/x.area
                    x.density = Math.round(density * 10) / 10
            .catch (error)->
                console.log 'Ошибка! Не могу связаться с API. ' + error
    methods: 
        openDialog: (ref)->
            @$refs[ref].open()

        closeDialog: (ref)->
            @$refs[ref].close()

        # glueFederalCity: ()->
        #     if @dataRegions[]
