var map = null;
var clickMarkerLayer = null;
var details = []

const checkPlace = (place) => {
  switch (place.type) {
    case "mall":
      return "Trung tâm thương mại";
    case "marketplace":
      return "Chợ";
    case "bus_stop":
      return "Trạm xe buýt";
    case "fuel":
      return "Trạm xăng dầu";
    default:
      switch (place.class) {
        case "amenity":
        case "highway":
        case "office":
          return "Đất công/Công viên/Hành lang an toàn giao thông";
        default:
          return "Đất tư nhân/nhà dân";
      }
  }
};

$(document).ready(async function () {

  async function fetchData() {
    try {
      const response = await fetch('https://server-ptudw.onrender.com/api/placeAds?fbclid=IwAR3fRxRkrq-S7z1miVQKr41r3t-uuHHu30I5oPVozm8mN2V_PkieJMC4vE8');
      const data = await response.json();
      return data.data;
    } catch (error) {
      l
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  map = L.map("map").setView([10.7769, 106.7009], 13);

  L.tileLayer(
    "https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=a1cb0032c1264a8d9a88251c4866a2c3",
    {
      attribution: "&copy; OpenStreetMap contributors, &copy; Thunderforest",
      apikey: "a1cb0032c1264a8d9a88251c4866a2c3",
    }
  ).addTo(map);

  const markers = L.markerClusterGroup({
    autoClose: false, // Set autoClose to false
  });

  clickMarkerLayer = L.layerGroup().addTo(map);

  const markersData = await fetchData();

  for (const marker of markersData) {
    const newMarker = L.marker([marker.lat, marker.long], {
      icon: L.divIcon({
        className: "custom-div-icon",
        html: `<iconify-icon icon=${!marker.info ? "material-symbols:personal-places-rounded" : "fluent:real-estate-20-filled"} style="color: ${marker.is_deleted ? "#2065D1" : "#5119B7"
          };" width="40" height="40"></iconify-icon>`,
        iconSize: [40, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
      }),
    });

    markers.addLayer(newMarker);
    newMarker
      .bindPopup(
        `<strong>${marker.type}</strong><br><br>${marker.address
        }<br><br><strong>${marker.is_deleted ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
        }</strong>`
      )

    newMarker.on("click", async function () {
      handleMarkerClick(newMarker, marker,);
    });
  }

  var previousMarkerState = null

  function handleMarkerClick(newMarker, marker) {
    const thongtinAd = `
  <div class="informflex">
    <div class="flex">
      <iconify-icon icon="carbon:information" style="color: #2065D1" width="25" height="25"></iconify-icon>
      <h2 style="color: #2065D1">Thông tin địa điểm quảng cáo</h2>
    </div>
    ${marker.ads.length ? marker.ads.map((ad, index) => adInfo(ad, marker.address, index)).join("") :
        `<h4>Chưa có biển quảng cáo</h4>`
      }
  </div>
`;

    function adInfo(ad, address, index) {
      return `
      <div class='ad_item ad_item_${index}'>
      <h2>${ad.ad.type}</h2>
      <div style="opacity: 0.8">${address
        }</div>
      <div style="opacity: 0.8">${ad.ad.content
        }</div>
      <div>Kích thước: <strong>${ad.ad.height
        }m x ${ad.ad.width}m </strong></div>
      <div>Số lượng: <strong>${ad.quantity
        } trụ/bảng</strong></div>
      <div >Phân loại: <strong>${marker.type
        }</strong></div>
      <div class="imagediv" >Hình ảnh: <img src=${ad.ad.urlImg
        }></div>
        <div class="flex">
          <button onclick="handleDetail(index=${index})">  <iconify-icon icon="ph:info-bold"  width="20" height="20"></iconify-icon>Chi tiết</button>
          <button onclick="handleReport(address='${address}')">  <iconify-icon icon="ri:alert-fill"  width="20" height="20"></iconify-icon>Báo cáo vi phạm</button>
        </div>
        </div>
       `;

    }

    function isEqual(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    if ($("#form_container") && $("#form_container").hasClass("active")) {
      $("#form_container").removeClass("active");
      $("#info_container").addClass("active");
    }

    newMarker.on("popupclose", function () {
      $("#ad_info").html("Chọn 1 điểm bất kỳ trên bản đồ").show();
      $("#ad_info").removeClass("active");
    });

    if (!$("#ad_info").hasClass("active") || !isEqual(marker, previousMarkerState)) {
      $("#map_info").html("Chọn 1 điểm bất kỳ trên bản đồ").show();
      $("#map_info").removeClass("active");
      $("#ad_info").addClass("active");
      $("#ad_info").html(thongtinAd).show();
    }

    newMarker.openPopup();


    previousMarkerState = marker;
  };

  map.on("click", async function (e) {
    let address = null;
    const clickMarker = L.marker(e.latlng, {
      icon: L.divIcon({
        className: "custom-div-icon",
        html: `<iconify-icon icon = "mdi:map-marker-radius" style = "color: #b71d18" width = "40" height = "40" ></iconify-icon > `,
        iconSize: [40, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
      }),
    });

    clickMarkerLayer.clearLayers()
    clickMarkerLayer.addLayer(clickMarker);

    $("#map_info").html('Đang tải... <iconify-icon icon="eos-icons:bubble-loading" width="20" height="20"></iconify-icon>').show();

    try {
      const response = await $.ajax({
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=vi`,
        method: "GET",
        dataType: "json",
      });

      address = response.display_name;

      const thongtinMap =
        `<div class="informflex">
                    <div class="flex">
                        <iconify-icon icon="carbon:information" style="color: "#2065D1" width="20" height="20"></iconify-icon>
                        <h2> Thông tin địa điểm</h2>
                    </div >
                    <div style="margin-top: 12px"><strong>${address}</strong></div>
                    <button style="margin-top: 12px" id="reportViolationBtn">  <iconify-icon icon="ri:alert-fill" style="color: "#D0342C" width="20" height="20"></iconify-icon>Báo cáo vi phạm</button>
                </div>
            `;


      $("#ad_info").html("Chọn 1 điểm quảng cáo trên bản đồ").show();
      if ($("#form_container") && $("#form_container").hasClass("active")) {
        $("#form_container").removeClass("active");
        $("#info_container").addClass("active");
      }

      $("#ad_info").removeClass("active");
      $("#map_info").html(thongtinMap).show();


      $("#reportViolationBtn").click(function () {
        createReportForm(address);
      });

      clickMarker
        .bindPopup(`${checkPlace(response)}<br><br>${address}<br><br>`)
        .openPopup();
      $("#map_info").addClass("active");
    } catch (error) {
      $("#map_info").html("<strong>Lỗi khi tải địa chỉ</strong>").show();
    }

    clickMarker.on("popupclose", function () {
      $("#map_info").html("Chọn 1 điểm bất kỳ trên bản đồ").show();
      $("#ad_info").removeClass("active");
      clickMarkerLayer.clearLayers()
    });
  });


  map.addLayer(markers);
});


async function createReportForm(address) {
  const formHTML = `
  <iconify-icon onclick="back()" icon="mingcute:back-fill" style="color: black; margin-bottom : 12px" width="20" height="20"></iconify-icon>
  <form>
    <div class='form-control'>
      <label for="display_name">Tên</label>
      <input class="form-input" name="display_name" type="text">
    </div>

    <div class='form-control'> 
      <label for="phone_number">Số điện thoại</label>
      <input class="form-input" name="phone_number" type="text">
    </div>

    <div class='form-control'> 
      <label for="location">Địa chỉ</label>
      <input class="form-input"  name="location" type="text" value="${address}">
    </div>

    <div class='form-control'>
      <label for="about">Lí do báo cáo</label>
      <input name="about" type="hidden">
      <div class="editor"></div>
    </div>

    <button class="btn btn-primary" type="submit">Gửi Báo Cáo</button>
  </form>
  `;

  $("#info_container").removeClass("active");
  $("#form_container").addClass("active");
  $("#form_container").html(formHTML);


  var quill = new Quill('.editor', {
    modules: {
      toolbar: [
        ['bold', 'italic'],
        ['image'],
        [{ list: 'ordered' }, { list: 'bullet' }]
      ]
    },
    placeholder: 'Có thể tải lên tối đa 2 hình ảnh',
    theme: 'snow'
  });

  var form = document.querySelector('form');

  async function getMaxFormId() {
    var allKeys = Object.keys(localStorage);
    var formIds = allKeys
      .filter(key => key.startsWith('form'))
      .map(key => parseInt(key.substring(4)))
      .filter(id => !isNaN(id));

    var maxId = formIds.reduce((max, id) => id > max ? id : max, 0);
    return 'form' + (maxId + 1);
  }


  form.onsubmit = async function (event) {
    event.preventDefault();
    const formId = await getMaxFormId()
    var about = document.querySelector('input[name=about]');
    about.value = JSON.stringify(quill.getContents());
    localStorage.setItem(formId, JSON.stringify($(form).serializeArray()));
    back()
  };

}

window.handleReport = function (address) {
  createReportForm(address)
}

window.handleDetail = function (index) {
  if (!details[index]) {
    details[index] = { isOpen: true };
  } else {
    details[index].isOpen = !details[index].isOpen;
  }

  const detail = document.body.querySelector(`.ad_item_${index}`)

  if (details[index].isOpen) {
    detail.querySelector('button').innerHTML = `<iconify-icon icon="ph:info-bold"  width="20" height="20"></iconify-icon> Thu gọn`;
    detail.classList.add('active')
  }
  else {
    detail.querySelector('button').innerHTML = `<iconify-icon icon="ph:info-bold"  width="20" height="20"></iconify-icon> Chi tiết`;
    detail.classList.remove('active')
  }
};

window.back = function () {
  $("#info_container").addClass("active");
  $("#form_container").removeClass("active");
}

window.handleMouseEnter = function (mode) {
  if (mode) {
    var menuDiv = document.querySelector('.menu-form');
    menuDiv.classList.add('active');
  }
  else {
    var searchDiv = document.querySelector('.search');
    searchDiv.classList.add('active');
  }

}

window.handleEnter = function (event) {
  if (event.key === 'Enter') {
    handleClick();
  }
}


window.handleMouseLeave = function (mode) {
  if (mode) {
    var menuDiv = document.querySelector('.menu-form');
    menuDiv.classList.remove('active');
  }
  else {
    var searchDiv = document.querySelector('.search');
    var inputValue = searchDiv.querySelector('input').value;
    var isInputFocused = document.activeElement === searchDiv.querySelector('input');

    if (inputValue === '' && !isInputFocused) {
      searchDiv.classList.remove('active');
    }
  }
}

window.handleFocus = function () {
  var searchDiv = document.querySelector('.search');
  searchDiv.classList.add('active');
}

window.handleBlur = function () {
  var searchDiv = document.querySelector('.search');
  var isInputFocused = document.activeElement === searchDiv.querySelector('input');

  if (!isInputFocused && searchDiv.querySelector('input').value === "") {
    searchDiv.classList.remove('active');
  }
}

window.handleClick = async function () {
  var searchDiv = document.querySelector('.search');
  var inputField = searchDiv.querySelector('input');
  const address = inputField.value;

  if (inputField.value === '') {
    inputField.focus();
  } else {
    try {
      const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + address);
      const data = await response.json();

      if (data.length > 0) {
        var result = data[0];
        var lat = result.lat;
        var lon = result.lon;

        var marker = L.marker([lat, lon]).addTo(map);

        // Xóa các Marker cũ nếu có
        clickMarkerLayer.clearLayers();

        // Thêm Marker mới
        clickMarkerLayer.addLayer(marker);

        // Đưa bản đồ về giữa Marker mới
        map.panTo([lat, lon]);
      } else {
        alert('Không tìm thấy địa chỉ');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
