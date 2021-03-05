/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Muhammed Shijas Babu Cherakkatil Student ID: 154742183 Date: 2021 Feb 05
*
*
********************************************************************************/ 


let restaurantData = [];
let currentRestaurant = {};
let page =1;
const perPage = 10;
let map = {
    map:null
};

function avg(grades){
    var average = 0.0;
    var length = grades.length;
    var total = 0;
    for(var i = 0; i < grades.length; i++){
        total+=grades[i].score;
    }
    average = total / length;
    return average.toFixed(2);
}

  const tableRows = _.template(
      `<% _.forEach(restaurants, function(rest){ %>
            <tr data-id=<%= rest._id %>>
                <td><%- rest.name %></td>
                <td><%- rest.cuisine %></td>
                <td><%- rest.address.building %> <%- rest.address.street %></td>
                <td><%- avg(rest.grades) %></td>
            </tr>
        <% }); %>`
        );
        

function loadRestaurantData(){
    fetch(`https://web422ass1.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
    .then((response) =>response.json())
    .then((myJson)=>{
        restaurantData = myJson;
        let retTable = tableRows({restaurants:restaurantData});
        $("#restaurant-table tbody").html(retTable);
        $("#current-page").html(page);
    })
}

$(function(){
    
    loadRestaurantData();
})
    //  1)	Click event for all tr elements within the tbody of the restaurant-table
    $("#restaurant-table tbody").on("click","tr",function(e){
        let dataId = $(this).attr("data-id");
        _.forEach(restaurantData, function(e){
            if(e._id == dataId){
                currentRestaurant = e;
            }
        })
        $(".modal-title").html(currentRestaurant.name);
        $("#restaurant-address").html(`<p>${currentRestaurant.address.building} ${currentRestaurant.address.street}</p>`);
        $('#restaurant-modal').modal('show');

    })

    // 2)	Click event for the "previous page" pagination button
    $("#previous-page").on("click", function(e){
        if(page > 1){
            page--;
        }
        loadRestaurantData();
    })

    //  3)	Click event for the "next page" pagination button
    $("#next-page").on("click",function(e){
        page++;
        loadRestaurantData();
    })

    //  4)	shown.bs.modal event for the "Restaurant" modal window
    $('#restaurant-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet', {
            center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
                new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
        });
        
        L.marker([currentRestaurant.address.coord[1],currentRestaurant.address.coord[0]]).addTo(map);
        
    });

    //5)	hidden.bs.modal event for the "Restaurant" modal window
    $("#restaurant-modal").on('hidden.bs.modal',function(){
        map.remove();
    })
