// Cấu hình Firebase
const dbRef = firebase.database().ref("khu_vuc_nuoi_ga"); // Tham chiếu đến dữ liệu Firebase ở nút "khu_vuc_nuoi_ga"

// Biến dữ liệu - Ban đầu tất cả bằng 0
let periods = ["Đợt 1", "Đợt 2"]; // Mảng chứa các đợt chăn nuôi
let revenue = [0, 0];  // Mảng chứa doanh thu khi bán gà, mặc định là 0
let cost = [0, 0];     // Mảng chứa chi phí chăn nuôi, mặc định là 0
let profit = [0, 0];   // Mảng chứa lợi nhuận, tính bằng doanh thu - chi phí

// Khởi tạo biểu đồ Bar Chart
let ctx = document.getElementById("chartGa").getContext("2d"); // Lấy đối tượng vẽ của biểu đồ
let chartGa = new Chart(ctx, {
    type: "bar", // Kiểu biểu đồ cột
    data: {
        labels: periods, // Nhãn trục x (các đợt chăn nuôi)
        datasets: [
            { label: " Doanh Thu", data: revenue, backgroundColor: "green" }, // Dữ liệu doanh thu (màu xanh)
            { label: " Chi Phí", data: cost, backgroundColor: "red" }, // Dữ liệu chi phí (màu đỏ)
            { label: " Lợi Nhuận", data: profit, backgroundColor: "blue" } // Dữ liệu lợi nhuận (màu xanh dương)
        ]
    },
    options: {
        responsive: true, // Biểu đồ tự động điều chỉnh theo kích thước màn hình
        maintainAspectRatio: true, // Giữ tỷ lệ không bị kéo dài
        legend: { display: true }, // Hiển thị chú thích
        title: { display: true, text: "Biểu đồ Doanh Thu - Chi Phí - Lợi Nhuận Gà" }, // Tiêu đề biểu đồ
        scales: { 
            yAxes: [{ 
                ticks: { beginAtZero: true }, // Bắt đầu trục y từ 0
                scaleLabel: { display: true, labelString: "Số tiền (VNĐ)" } // Nhãn trục y
            }] 
        },
        animation: {
            duration: 1500, // Thời gian chạy animation là 1.5 giây
            onComplete: function () {
                let ctx = this.chart.ctx; // Lấy đối tượng vẽ của biểu đồ
                ctx.font = "14px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "#000"; // Màu chữ là đen
                this.data.datasets.forEach((dataset, i) => {
                    let meta = this.chart.getDatasetMeta(i);
                    meta.data.forEach((bar, index) => {
                        let value = dataset.data[index]; // Lấy giá trị của từng cột
                        ctx.fillText(value, bar._model.x, bar._model.y - 5); // Vẽ giá trị lên trên từng cột
                    });
                });
            }
        }
    }
});

// Lấy dữ liệu từ Firebase và cập nhật biểu đồ
dbRef.on("value", (snapshot) => {
    let data = snapshot.val(); // Lấy dữ liệu từ Firebase
    if (data) {
        for (let i = 0; i < 2; i++) {
            revenue[i] = data[`dot${i + 1}`]?.doanhthu || 0; // Cập nhật doanh thu từ Firebase
            cost[i] = data[`dot${i + 1}`]?.chiphi || 0; // Cập nhật chi phí từ Firebase
            profit[i] = revenue[i] - cost[i]; // Tính toán lợi nhuận
        }
        chartGa.data.datasets[0].data = revenue; // Cập nhật dữ liệu doanh thu trên biểu đồ
        chartGa.data.datasets[1].data = cost; // Cập nhật dữ liệu chi phí trên biểu đồ
        chartGa.data.datasets[2].data = profit; // Cập nhật dữ liệu lợi nhuận trên biểu đồ
        chartGa.update(); // Cập nhật lại biểu đồ
    }
});

// Bật tắt công tắc (Switch)
$(function() {
  $('#toggle-trigger').change(function() {      
      var state = $(this).prop('checked');
  
      if(state == true){
        $('#state').text('LIGHT:ON');
        document.getElementById("canhbaoId_01").src = "./img/light_bulb.png"
        // Gửi dữ liệu đến Firebase
        firebase.database().ref("test/ga").update({
        DEN: "ON"})
      }
      else{
        $('#state').text('LIGHT:OFF');
        document.getElementById("canhbaoId_01").src = "./img/light_bulb_off.png"
        // Gửi dữ liệu đến Firebase
        firebase.database().ref("test/ga").update({
          DEN: "OFF"})
    }
  })
})


// Lắng nghe thay đổi trạng thái đèn từ Firebase
firebase.database().ref("test/ga/DEN").on("value",function(snapshot){
  var tivi = snapshot.val();
  if(tivi === "ON"){
    document.getElementById("canhbaoId_01").src = "./img/light_bulb.png"
    $('#state').text('LIGHT:ON' );  
  }
  else if(tivi === "OFF"){
    document.getElementById("canhbaoId_01").src = "./img/light_bulb_off.png"
    $('#state').text('LIGHT:OFF' ); 
  }
});

// Lắng nghe nhiệt độ từ Firebase
firebase.database().ref("test/ga/NHIETDO").on("value", function(snapshot) {
  var nhietdo = snapshot.val();
  document.getElementById("nhietdo98").innerText = nhietdo + "°C";
});
//////////////////////////////////////////////////////////////////////
// Điều khiển đèn 01
var quatOn = document.getElementById("batquat");
var quatOff = document.getElementById("tatquat");

quatOn.onclick = function(){
  document.getElementById("quatId_01").src = "./img/light_bulb.png"
  firebase.database().ref("test/ga").update({
          DEN1: "ON"})
}

quatOff.onclick = function(){
document.getElementById("quatId_01").src = "./img/light_bulb_off.png"
firebase.database().ref("test/ga").update({
          DEN1: "OFF"})
}

// Theo dõi trạng thái đèn 01 từ Firebase
firebase.database().ref("test/ga/DEN1/").on("value",function(snapshot){
  var quat = snapshot.val();
  if(quat === "ON"){
    document.getElementById("quatId_01").src = "./img/light_bulb.png"
  }
  else if(quat === "OFF"){
    document.getElementById("quatId_01").src = "./img/light_bulb_off.png"
  }
});

/////////////////////////////////////////////////////////
// điều chỉnh cấp độ đèn
var sliderNgang = document.getElementById("sliderNgangId");
var y = 0;

// Lắng nghe sự kiện khi thanh trượt được di chuyển
sliderNgang.addEventListener("mousemove", function () {
  // Hiển thị giá trị hiện tại của thanh trượt trên giao diện người dùng
  document.getElementById("nhietdo").innerHTML = sliderNgang.value;

  var slider = sliderNgang.value; // Lấy giá trị của thanh trượt

  // Cập nhật giá trị độ sáng đèn lên Firebase
  firebase.database().ref("test/ga").update({
      "DEN2": slider
  });

  // Điều chỉnh độ sáng bằng cách thay đổi độ mờ (opacity) của phần tử
  var x = document.getElementById("myDIV");
  y = (sliderNgang.value) * 0.1; // Chuyển giá trị về khoảng 0 - 1

  if (y < 1) {
      x.style.opacity = y; // Giảm độ sáng theo thanh trượt
  } else {
      x.style.opacity = 1; // Giữ độ sáng tối đa khi giá trị lớn hơn 1
  }
});

// Lắng nghe sự thay đổi giá trị từ Firebase
firebase.database().ref("test/ga/DEN2").on("value", function (snapshot) {
  var slider = snapshot.val(); // Lấy giá trị hiện tại từ Firebase

  // Cập nhật giá trị thanh trượt từ Firebase lên giao diện
  document.getElementById("sliderNgangId").value = slider;
  document.getElementById("nhietdo").innerHTML = sliderNgang.value;

  // Cập nhật độ sáng dựa trên giá trị từ Firebase
  var x = document.getElementById("myDIV");
  y = (sliderNgang.value) * 0.1;

  if (y < 1) {
      x.style.opacity = y; // Giảm độ sáng nếu giá trị nhỏ hơn 1
  } else {
      x.style.opacity = 1; // Đảm bảo độ sáng tối đa nếu giá trị lớn hơn 1
  }
});






