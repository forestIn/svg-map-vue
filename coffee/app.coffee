Vue.use(VueMaterial)
bus = new Vue

Vue.component 'svg-map', 
    template: '<g><region-path v-for="(value, key) in  regions"
                                :index="key"
                                :region="value">
                   </region-path>
              </g>',
    props: ['regions']
    components:
        'region-path':
            props:
                region:Object
                index:Number                
            template:'<path 
                        :index="index"                         
                        :d="region.path"               
                        v-on:click="getInfo" 
                        v-on:mouseover="mouseOver" 
                        v-on:mouseout="mouseOut" 
                        class="state" 
                        v-if="region.show"
                        v-bind:class="{ regionActive: isActive}"/>'
            data: ()->
                return { 
                    isActive: false,                    
                }
            methods:
                getInfo: ()->
                    bus.$emit 'modal', @index
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
        title:""
        regions:""
        dataRegion:""
        showModal:false

    created: ()->
        vm = @

        bus.$on 'modal', (id)->
            vm.dataRegion = vm.regions[id]
            vm.$refs['dialog1'].open() 

        bus.$on 'regionName', (name)->
            vm.title = name
        bus.$on 'regionNameOut', ()->
            vm.title = ''            

        axios.get('js/data.json')
                .then (response)->                   
                    regions = response.data
                    for region of regions
                        regions[region]['show']=true
                        density = (regions[region].city_population+regions[region].country_population)/regions[region].area
                        regions[region]['density']=Math.round(density * 10) / 10
                    vm.regions = regions

                    
                .catch (error)->
                    console.log 'Ошибка! Не могу связаться с API. ' + error
                return
    methods: 
        changeVisible: (name)->
            regions = @regions.filter (value, index, self)->
                value.fed_okrug==name
            for region of regions
                regions[region].show=!regions[region].show

        openDialog: (ref)->
            @$refs[ref].open()

        closeDialog: (ref)->
            @$refs[ref].close()
    computed:
        federal_okrug: ()->
            okrugs_show = []
            okrugs = (region.fed_okrug for region in @regions)
            okrugs = okrugs.filter (value, index, self)->
                self.indexOf(value)==index
            for okrug in okrugs
                okrugs_show.push({'name':okrug,'show':true})
            okrugs_show

