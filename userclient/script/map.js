var markersData = [
  {
    lat: 10.7805,
    lon: 106.6991,
    type: 0,
    info: {
      htqc: "Cổ động chính trị",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "2.5", rong: "34.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.7761,
    lon: 106.7024,
    type: 1,
    info: {
      htqc: "Quảng cáo thương mại",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "2.5", rong: "31.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.7823,
    lon: 106.6952,
    type: 1,
    info: {
      htqc: "Xã hội hoá",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "2.5", rong: "3.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.54347,
    lon: 106.39759,
    type: 0,
    info: {
      htqc: "Quảng cáo thương mại",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "2.5", rong: "3.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.7679,
    lon: 106.6933,
    type: 1,
    info: {
      htqc: "Cổ động chính trị",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "23.5", rong: "3.25" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.77225,
    lon: 106.66505,
    type: 0,
    info: {
      htqc: "Cổ động chính trị",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "24.5", rong: "3.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.7847,
    lon: 106.6942,
    type: 0,
    info: {
      htqc: "Cổ động chính trị",
      qc: { kqc: "Trụ,cụm Pano", kt: { dai: "21.5", rong: "3.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.77036,
    lon: 106.67228,
    type: 1,
    info: {
      htqc: "Xã hội hoá",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "5.5", rong: "3.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
  {
    lat: 10.77059,
    lon: 106.66949,
    type: 1,
    info: {
      htqc: "Xã hội hoá",
      qc: { kqc: "Trụ, cụm Pano", kt: { dai: "23.5", rong: "33.5" }, sl: "1" },
      haqc: "https://panoquangcao.net/wp-content/uploads/2020/09/tru-bien-quang-cao-5-768x507.jpg",
    },
  },
];

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

$(document).ready(function () {
  var map = L.map("map").setView([10.7769, 106.7009], 13);

  L.tileLayer(
    "https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=a1cb0032c1264a8d9a88251c4866a2c3",
    {
      attribution: "&copy; OpenStreetMap contributors, &copy; Thunderforest",
      apikey: "a1cb0032c1264a8d9a88251c4866a2c3",
    }
  ).addTo(map);

  var markers = L.markerClusterGroup();
  var clickMarkerLayer = L.layerGroup().addTo(map);

  const markersDataWithFetchStatus = markersData.map((marker) => ({
    ...marker,
    isDataFetched: false,
  }));

  for (const marker of markersDataWithFetchStatus) {
    const newMarker = L.marker([marker.lat, marker.lon], {
      icon: L.divIcon({
        className: "custom-div-icon",
        html: `<iconify-icon icon="material-symbols:personal-places-rounded" style="color: ${marker.type ? "#2065D1" : "#5119B7"
          };" width="40" height="40"></iconify-icon>`,
        iconSize: [40, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
      }),
    });
    markers.addLayer(newMarker);

    newMarker.on("click", function () {
      handleMarkerClick(newMarker, marker);
    });
  }


  async function fetchData(marker) {

    try {
      if (!marker.isDataFetched) {
        $("#ad_info").html("Đang tải...").show();
        const res = await $.ajax({
          url: `https://nominatim.openstreetmap.org/reverse`,
          data: {
            format: "json",
            lat: marker.lat,
            lon: marker.lon,
            "accept-language": "vi",
          },
          method: "GET",
          dataType: "json",
          timeout: 10000,
        });

        marker.response = res;
        marker.isDataFetched = true;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }

  var previousMarkerState = null

  async function handleMarkerClick(newMarker, marker) {

    fetchData(marker).then(() => {
      const thongtinAd = `<div class="informflex">
      <div class="flex">
          <iconify-icon icon="carbon:information" style="color: "#2065D1" width="30" height="30"></iconify-icon>
          <h1 style="color: '#2065D1'">Thông tin địa điểm quảng cáo</h1>
      </div>
      <h2 style="margin-top: 24px">${marker.info.qc.kqc}</h2>
      <div style="opacity: 0.8">${marker.response.display_name
        }</div>
      <div>Kích thước: <strong>${marker.info.qc.kt.dai
        }m x ${marker.info.qc.kt.rong}m </strong></div>
      <div>Số lượng: <strong>${marker.info.qc.sl
        } trụ/bảng</strong></div>
      <div >Phân loại: <strong>${checkPlace(
          marker.response
        )} trụ/bảng</strong></div>
      <div class="imagediv">Hình ảnh: <img src=${marker.info.haqc
        }></div>
      <button id="reportViolationBtn">  <iconify-icon icon="ri:alert-fill" style="color: "#D0342C" width="20" height="20"></iconify-icon>Báo cáo vi phạm</button>
  </div>`;




      function isEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      }


      if (!$("#ad_info").hasClass("active") || !isEqual(marker, previousMarkerState)) {
        $("#map_info").html("Chọn 1 điểm bất kỳ trên bản đồ").show();
        $("#map_info").removeClass("active");
        $("#ad_info").addClass("active");
        $("#ad_info").html(thongtinAd).show();
      }


      $("#reportViolationBtn").click(function () {
        createReportForm();
      });

      newMarker
        .bindPopup(
          `<strong>${marker.info.htqc}</strong><br><br>${checkPlace(
            marker.response
          )}<br><br>${marker.response.display_name}<br><br><strong>${marker.type ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
          }</strong>`
        )
        .openPopup();

      previousMarkerState = { ...marker };
    });
  }

  map.on("click", async function (e) {
    let address = null;
    const clickMarker = L.marker(e.latlng, {
      icon: L.divIcon({
        className: "custom-div-icon",
        html: `<iconify-icon icon="mdi:map-marker-radius" style="color: #b71d18" width="40" height="40"></iconify-icon>`,
        iconSize: [40, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
      }),
    });

    clickMarkerLayer.clearLayers().addLayer(clickMarker);

    $("#map_info").html("Đang tải...").show();

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
                    <div style="margin-top: 24px"><strong>${address}</strong></div>
                    <button id="reportViolationBtn">  <iconify-icon icon="ri:alert-fill" style="color: "#D0342C" width="20" height="20"></iconify-icon>Báo cáo vi phạm</button>
                </div>
            `;


      $("#ad_info").html("Chọn 1 điểm quảng cáo trên bản đồ").show();
      $("#ad_info").removeClass("active");
      $("#map_info").html(thongtinMap).show();

      $("#reportViolationBtn").click(function () {
        createReportForm();
      });

      clickMarker
        .bindPopup(`${checkPlace(response)}<br><br>${address}<br><br>`)
        .openPopup();
      $("#map_info").addClass("active");
    } catch (error) {
      $("#map_info").html("<strong>Lỗi khi tải địa chỉ</strong>").show();
    }
  });

  map.addLayer(markers);
});


function createReportForm() {
  const formHTML = `
    <form id="reportForm">
      <!-- Your form fields go here -->
      <label for="reason">Lý do báo cáo:</label>
      <textarea id="reason" name="reason" rows="4" cols="50"></textarea>
      <br>
      <input type="submit" class="submit" value="Gửi báo cáo">
    </form>
  `;

  $("#info_container").removeClass("active");
  $("#form_container").addClass("active");
  $("#form_container").html(formHTML);

  // Attach submit event for the report form
  $("#reportForm").submit(function (event) {
    event.preventDefault();
    alert("Báo cáo đã được gửi đi!");
  });
}