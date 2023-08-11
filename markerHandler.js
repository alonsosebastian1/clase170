var tableNumber = null;
AFRAME.registerComponent("markerHandler",{
    init:async function(){
        if(tableNumber === null){
          this.askTableNumber();
        }
        var dishes = await this.getDishes();
        this.el.addEventListener("markerFound",()=>{
            if(tableNumber !== null){
                var markerId = this.el.id;
                this.handleMarkerFound(dishes,markerId);
            }
        });
        this.el.addEventListener("markerLost",()=>{
            this.handleMarkerLost();
        })
    },
    askTableNumber:function(){
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
        swal({
            title:"bienvenido a el antojo",
            icon:iconUrl,
            content:{
                element:"input",
                attributes:{placeholder:"escribe el numero de tu mesa",
            type:"number",
        min:1}
            },
          closeOnClickOutside:false,
        }).then(inputValue=>{
            tableNumber=inputValue
        })
    },
    handleMarkerFound:function(dishes,markerId){
        var toDaysDate = new Date();
        var toDaysDay = toDaysDate.getDay();
        var days=[
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ]
        var dish=dishes.filter(dish=>dish.id === markerId)[0];
        if(dish.unavailable_days.include(days[toDaysDay])){
            swal({
                icon:"warning",
                title:dish.dish_name.toUpperCase(),
                text:"este platillo no esta disponible hoy",
                timer:2500,
                buttons:false
            })
        }else{
            var model = document.querySelector(`#model-${dish.id}`);

        }
     var buttonDiv = document.getElementById("button-div");
     buttonDiv.style.display = "flex";
     var ratingButton = document.getElementById("rating-button");
     var orderButton = document.getElementById("order-button");
     
     ratingButton.addEventListener("click",function(){
        swal({
            icon:"warning",
            title:"calificar platillo",
            text:"procesando calificacion"
        })
     });
     orderButton.addEventListener("click",()=>{
        swal({
            icon:"https://i.imgur.com/4NZ6uLY.jpg",
            title:"gracias por tu orden",
            text:"resiviras tu orden pronto"
        })
     })
     var dish = dishes.filter(dish=> dish.id === markerId)[0];
     var model = document.querySelector(`#model-${dish.id}`);
     model.setAttribute("position",dish.model_geometry.position);
     model.setAttribute("rotation",dish.model_geometry.rotation);
     model.setAttribute("scale",dish.model_geometry.scale);
    },
    handleMarkerLost:function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display="none";
    },
    getDishes:async function(){
        return await firebase
        .fireStore()
        .collection("dishes")
        .get()
        .then(snap=>{
            return snap.docs.map(doc=>doc.data());
        })
    }
})