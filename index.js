//解析json传回来的数据
function analysis(data){    
    var end_obj1 = []; 
    var end_obj2 = []; 
    var end_obj3 = []; 
    var end_obj4 = [];
    var end_obj = []; 
    var cl = data.compute.length;
    var stl = data.storage.length;
    var swl =  data.switchs.length;

    //compute节点
    for(var i = 0; i < data.compute.length; i++){
        var obj1 = {name:'',obj_id:'',x:0,y:100,symbol:'',status:'',symbolSize: [113,38]};//compute
        obj1.name = data.compute[i].name;
        obj1.obj_id = data.compute[i].id;
        obj1.value = data.compute[i].type;
        if(data.storage.length == 0){
             obj1.x = 50*(i+1);
        }else{
            // obj1.x = 133*(i+1);
            if(cl == 1){
                obj1.x = 1200/2-(113/2);
            }else{
                obj1.x = 1200/(cl+1)*(i+1)-(113/2);

            }
            
        }
        obj1.status = data.compute[i].status;
        if(obj1.status == 1){
             obj1.symbol = 'image://images/node.png';
        }
       else{
         obj1.symbol = 'image://images/node_red.png';
       }
        end_obj1.push(obj1);    
    };
    var compute_last_x = 0;
    if(data.compute.length > 0){    
     compute_last_x = end_obj1[end_obj1.length-1].x;
    }else{
       compute_last_x = 0; 
    }
    //      //mix节点
    //   for(var m = 0; m < data.mix.length; m++){
    //     var obj4 = {name:'',obj_id:'',x:0,y:100,symbol:'',status:'',symbolSize: [113,38]};//compute
    //     obj4.name = data.mix[m].name;
    //     obj4.obj_id = data.mix[m].id;
    //     obj4.value = data.mix[m].type;
    //      if(data.storage.length == 0){
    //          obj4.x = 50*(m+1);
    //     }else{
    //          if(cl+ml == 1){
    //             obj4.x = 1200/2-(113/2);
    //         }else{
    //             obj4.x = compute_last_x +1200/(cl+ml+1)*(m+1)-(113/2);

    //         }
    //         // obj4.x = compute_last_x +166*(m+1);
             
    //     }
       
    //     obj4.status = data.mix[m].status;
    //     if(obj4.status == 1){
    //          obj4.symbol = 'image:images/virtual.png';
    //     }
    //    else{
    //      obj4.symbol = 'image:images/node_red.png';
    //    }
    //     end_obj4.push(obj4);    
    // };

     var mix_compute = [];
    mix_compute.push(end_obj1);
     // mix_compute.push(end_obj1,end_obj4);
    var mix_compute_attr = [];
    for(var d = 0; d <mix_compute.length; d++){
        for(var f = 0; f<mix_compute[d].length; f++){
         mix_compute_attr.push(mix_compute[d][f]);
        }
    }

    //storage节点
    for(var j = 0; j < data.storage.length; j++){
        var obj2 = {name:'',obj_id:'',x:0,y:500,symbol:'',status:'',symbolSize: [113,38]};//storage
        obj2.name = data.storage[j].name;
        obj2.obj_id = data.storage[j].id;
        obj2.value = data.storage[j].type;
        // obj2.x = 150*(j+1);
        if(stl == 1){
                obj2.x = 1200/2-(113/2);
            }else{
                obj2.x = 1200/(stl+1)*(j+1)-(113/2);

            }
      
        obj2.status = data.storage[j].status;
         if(obj2.status == 1){
             obj2.symbol = 'image://images/node.png';
        }
       else{
         obj2.symbol = 'image://images/node_red.png';
       }
        end_obj2.push(obj2);
    };
    //switch节点
    for(var k = 0; k <data.switchs.length; k++){
        var obj3 = {name:'',x:0,y:300,symbol:'',symbolSize: [113,38]};
        obj3.name = data.switchs[k].name;
         if(end_obj2.length == 0){
            obj3.x = 50*(k+1);
           obj3.y = 200; 
         }else{
             // obj3.x = 166*(k+1);
             if(swl == 1){
                obj3.x = 1200/2-(113/2);
            }else{
                obj3.x = 1200/(swl+1)*(k+1)-(113/2);

            }
             
             obj3.y = 300; 
         }
       
        obj3.symbol = 'image://images/switch.png';
        end_obj3.push(obj3);
    };
    //在push上面几个数组的时候，要将data.storage的节点数组放在data.compute之前,为什么还是清楚
     end_obj.push(end_obj2,mix_compute_attr,end_obj3);
    var attr = [];
    for(var b = 0; b <end_obj.length; b++){
        for(var c = 0; c<end_obj[b].length; c++){
         attr.push(end_obj[b][c]);
        }
    }
    return attr;  
};

function analysis_link(data){
    var end_links = [];
    for(var a = 0; a< data.length; a++){
        var links = {flow:0,source:'',target:''};
        links.flow = data[a].flow;
        links.source = data[a].source;
        links.target = data[a].target;
        end_links.push(links);
    }
    return end_links;
}
$(document).ready(function () {

	
    //显示下方最大的echarts.
    var arch_show = function () {
        var arch_chart = echarts.init(document.getElementById('architecture_chart'));

       var option = {
            title: {
                text: '体系结构图'
            },
            tooltip : {
                trigger: 'item',
                formatter:function(params){
                    if(params.data.flow != null){
                        return params.data.source + '到' + params.data.target + '的流量为'+ params.data.flow;
                    }
                    else{
                        return params.name;
                    }
                }  
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    roam: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',

                            textStyle:{
                                fontSize:15,
                                 color:'#666666',
                            }
                        }
                    },
                    edgeSymbol: ['arrow', 'arrow'],
                    edgeSymbolSize: [12, 12],
                    lineStyle: {
                        normal: {
                            opacity: 0.6,
                            width: 5,
                            height:10,
                            curveness: 0,
                            color: '#7CFC00' ,
                            type:'dashed' 
                        }
                    },
                    data:[],
                    links:[]
                }
            ]
        };

        // arch_chart.showLoading();
         $.ajax({
            type: "get",
            url: "index.json",
            // async: false,
            success: function (response) {
                var myData = response;
                option.series[0].data =  analysis(myData);
                option.series[0].links = analysis_link(myData.links);
                arch_chart.setOption(option);

            },
            error:function(res){
            	alert("error!");
            }
        });


       

         //每隔一段时间执行一次Ajax请求..
        // setInterval(function () {
        //     arch_show();
        // }, 60000);


        $(window).resize(arch_chart.resize);
         //实现节点点击事件
        arch_chart.on('click', function(e){
            if(e.data){
            	alert("Hello  "+e.data.name+"   你可以做一些自己的点击事件！！");
                // window.location.href = '';
            }
        });

    };
    arch_show();
});