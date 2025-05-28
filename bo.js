// ✅ Cấu hình Firebase (bỏ qua nếu đã có cấu hình trong bo.js)
const dbRef = firebase.database().ref("khu_vuc_nuoi_bo");  // Tạo tham chiếu đến khu vực nuôi bò trong Firebase

// ✅ Biến lưu dữ liệu
let months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]; // Danh sách các tháng trong năm
let totalCows = Array(12).fill(0);  // Mảng lưu tổng số bò trong từng tháng, ban đầu là 0
let soldCows = Array(12).fill(0);   // Mảng lưu số bò đã bán trong từng tháng, ban đầu là 0
let remainingCows = Array(12).fill(0); // Mảng lưu số bò còn lại, ban đầu là 0

// ✅ Khởi tạo biểu đồ
let ctx = document.getElementById("myChart").getContext("2d");  // Lấy thẻ canvas có id "myChart" và lấy ngữ cảnh vẽ 2D
let myChart = new Chart(ctx, {  // Tạo biểu đồ mới với Chart.js
    type: "line",  // Loại biểu đồ là biểu đồ đường (line chart)
    data: {
        labels: months,  // Trục x là các tháng trong năm
        datasets: [
            { label: "Tổng số bò", data: totalCows, borderColor: "red", fill: false }, // Đường màu đỏ thể hiện tổng số bò
            { label: "Số bò đã bán", data: soldCows, borderColor: "green", fill: false }, // Đường màu xanh lá thể hiện số bò đã bán
            { label: "Số bò còn lại", data: remainingCows, borderColor: "blue", fill: false } // Đường màu xanh dương thể hiện số bò còn lại
        ]
    },
    options: {
        legend: { display: true }, // Hiển thị chú thích biểu đồ
        title: { display: true, text: "Biểu đồ số bò theo từng tháng" }, // Tiêu đề biểu đồ
        scales: { yAxes: [{ ticks: { beginAtZero: true } }] } // Trục y bắt đầu từ 0
    }
});

// ✅ Hàm cập nhật dữ liệu từ Firebase
dbRef.on("value", (snapshot) => { // Lắng nghe dữ liệu thay đổi trên Firebase
    let data = snapshot.val(); // Lấy dữ liệu từ snapshot
    if (data) {  // Nếu có dữ liệu
        for (let i = 0; i < 12; i++) {  // Lặp qua 12 tháng
            totalCows[i] = data[`thang${i + 1}`]?.tongbo || 0; // Lấy số bò tổng trong tháng, nếu không có thì mặc định là 0
            soldCows[i] = data[`thang${i + 1}`]?.boban || 0; // Lấy số bò đã bán trong tháng, nếu không có thì mặc định là 0
            remainingCows[i] = totalCows[i] - soldCows[i]; // Số bò còn lại = tổng số bò - số bò đã bán
        }
        myChart.data.datasets[0].data = totalCows; // Cập nhật dữ liệu tổng số bò vào biểu đồ
        myChart.data.datasets[1].data = soldCows; // Cập nhật dữ liệu số bò đã bán vào biểu đồ
        myChart.data.datasets[2].data = remainingCows; // Cập nhật dữ liệu số bò còn lại vào biểu đồ
        myChart.update(); // Cập nhật lại biểu đồ
    }
});

// ✅ Bật/Tắt đèn qua switch
$(function() {
    $('#toggle-trigger').change(function() {  // Khi switch thay đổi trạng thái  
        var state = $(this).prop('checked'); // Kiểm tra switch đang bật hay tắt
    
        if(state == true){ // Nếu switch bật
          $('#state').text('LIGHT:ON'); // Hiển thị trạng thái ON
          document.getElementById("canhbaoId_01").src = "./img/light_bulb.png"; // Đổi ảnh đèn sáng
          firebase.database().ref("test/bo").update({ DEN: "ON"}); // Gửi trạng thái đèn lên Firebase
        }
        else{ // Nếu switch tắt
          $('#state').text('LIGHT:OFF'); // Hiển thị trạng thái OFF
          document.getElementById("canhbaoId_01").src = "./img/light_bulb_off.png"; // Đổi ảnh đèn tắt
          firebase.database().ref("test/bo").update({ DEN: "OFF"}); // Gửi trạng thái đèn lên Firebase
        }
    })
})

// ✅ Lắng nghe thay đổi trạng thái của đèn từ Firebase
firebase.database().ref("test/bo/DEN").on("value", function(snapshot){
    var tivi = snapshot.val(); // Lấy trạng thái đèn từ Firebase
    if(tivi === "ON"){
      document.getElementById("canhbaoId_01").src = "./img/light_bulb.png"; // Đổi ảnh đèn sáng
      $('#state').text('LIGHT:ON');  
    }
    else if(tivi === "OFF"){
      document.getElementById("canhbaoId_01").src = "./img/light_bulb_off.png"; // Đổi ảnh đèn tắt
      $('#state').text('LIGHT:OFF'); 
    }
});

// ✅ Điều khiển quạt
var quatOn = document.getElementById("batquat"); // Lấy button bật quạt
var quatOff = document.getElementById("tatquat"); // Lấy button tắt quạt

quatOn.onclick = function(){ // Khi bấm nút bật quạt
    document.getElementById("quatId_01").src = "./img/fan_on.gif"; // Đổi ảnh quạt đang quay
    firebase.database().ref("test/bo").update({ QUAT: "ON"}); // Gửi trạng thái bật quạt lên Firebase
}

quatOff.onclick = function(){ // Khi bấm nút tắt quạt
  document.getElementById("quatId_01").src = "./img/quat_off.jpg"; // Đổi ảnh quạt tắt
  firebase.database().ref("test/bo").update({ QUAT: "OFF"}); // Gửi trạng thái tắt quạt lên Firebase
}

// ✅ Lắng nghe trạng thái quạt từ Firebase
firebase.database().ref("test/bo/QUAT").on("value", function(snapshot){
    var quat = snapshot.val(); // Lấy trạng thái quạt từ Firebase
    if(quat === "ON"){
      document.getElementById("quatId_01").src = "./img/fan_on.gif"; // Nếu quạt đang bật, đổi ảnh quay
    }
    else if(quat === "OFF"){
      document.getElementById("quatId_01").src = "./img/quat_off.jpg"; // Nếu quạt đang tắt, đổi ảnh tắt
    }
});

// ✅ Lắng nghe nhiệt độ từ Firebase
firebase.database().ref("test/bo/NHIETDO").on("value", function(snapshot) {
    var nhietdo = snapshot.val(); // Lấy nhiệt độ từ Firebase
    document.getElementById("nhietdo99").innerText = nhietdo + "°C"; // Hiển thị nhiệt độ lên giao diện
});

// ✅ Điều chỉnh độ sáng đèn bằng thanh trượt
var sliderNgang = document.getElementById("sliderNgangId"); // Lấy thanh trượt
sliderNgang.addEventListener("mousemove", function(){
    document.getElementById("nhietdo").innerHTML = sliderNgang.value; // Hiển thị giá trị thanh trượt
    var slider = sliderNgang.value;
    firebase.database().ref("test/bo").update({ "DEN2":  slider}); // Gửi giá trị lên Firebase
    document.getElementById("myDIV").style.opacity = slider * 0.01; // Điều chỉnh độ sáng
});


// ✅ Lắng nghe nhiệt độ từ Firebase
firebase.database().ref("test/bo/DOAM").on("value", function(snapshot) {
  var doam= snapshot.val(); // Lấy nhiệt độ từ Firebase
  document.getElementById("doam3").innerText = doam + ""; // Hiển thị nhiệt độ lên giao diện
});










