export default {
    attributes:{
        campaign_id:'',
        description:'',
        end_date:null,
        start_date:null,
    },
    type:'promotions',
    relationships:{
        campaign:{
            data:{
                id:'',
                type:'campaigns'
            }
        }
    }
}