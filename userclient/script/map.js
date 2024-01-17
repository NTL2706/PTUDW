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
            // const response = await fetch('https://server-ptudw.onrender.com/api/placeAds?fbclid=IwAR3fRxRkrq-S7z1miVQKr41r3t-uuHHu30I5oPVozm8mN2V_PkieJMC4vE8');
            const response = await fetch('http://localhost:5000/api/placeAds?fbclid=IwAR3fRxRkrq-S7z1miVQKr41r3t-uuHHu30I5oPVozm8mN2V_PkieJMC4vE8');
            const data = await response.json();
            return data.data;
        } catch (error) {
            l
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    map = L.map("map")

    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        map.setView([lat, lon], 13);
    });

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
        console.log(marker)
        const newMarker = L.marker([marker.lat, marker.lon], {
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
        console.log(marker._id)
        const thongtinAd = `
  <div class="informflex">
    <div class="flex">
      <iconify-icon icon="carbon:information" style="color: #2065D1" width="25" height="25"></iconify-icon>
      <h2 style="color: #2065D1">Thông tin địa điểm quảng cáo</h2>
    </div>
    ${marker.ads.length ? marker.ads.map((ad, index) => adInfo(ad, marker.address, index, marker._id)).join("") :
                `<h4>Chưa có biển quảng cáo</h4>`
            }
  </div>
`;

        function adInfo(ad, address, index, id) {
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
          <button onclick="handleReport(address='${address}' , idPlace='${id}' , idAd ='${ad.ad._id}')">  <iconify-icon icon="ri:alert-fill"  width="20" height="20"></iconify-icon>Báo cáo vi phạm</button>
        </div>
        </div>
       `;

        }

        function isEqual(obj1, obj2) {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        }

        if (!$("#info_container").hasClass("active")) {
            $("#form_container").removeClass("active");
            $("#report_container").removeClass("active");
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
            if (!$("#info_container").hasClass("active")) {
                $("#form_container").removeClass("active");
                $("#info_container").addClass("active");
                $("#report_container").removeClass("active");
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


async function createReportForm(address, idPlace, idAd) {
    const formHTML = `
  <iconify-icon onclick="back()" icon="mingcute:back-fill" style="color: black; margin-bottom : 12px" width="20" height="20"></iconify-icon>
  <form enctype="multipart/form-data">
    <div class='form-control'>
      <label for="display_name">Tên</label>
      <span class="label display_name">Độ dài tên vượt quá qui định</span>
      <input class="form-input" name="display_name" type="text" placeholder="Nhập tên không quá 50 kí tự" oninput="handleChangeInput(this)">
    </div>

    <div class='form-control'> 
      <label for="email">Email</label>
      <span class="label email">Vui lòng nhập đúng địa chỉ Email</span>
      <input class="form-input" name="email" type="email" placeholder="Nhập Email" oninput="handleChangeInput(this)">
    </div>

    <div class='form-control'> 
      <label for="phone_number">Số điện thoại</label>
      <span class="label phone_number">Vui lòng nhập đúng số điện thoại</span>
      <input class="form-input" name="phone_number" type="text" placeholder="Nhập SĐT" oninput="handleChangeInput(this)">
    </div>

    <div class='form-control'> 
      <label for="location">Địa chỉ</label>
      <input class="form-input"  name="location" type="text" value="${address}">
    </div>

    <div class='form-control'>
      <label for="about">Lí do báo cáo</label>
      <span class="label edit">Vui lòng chỉ Upload tối đa 2 ảnh</span>
      <input name="about" type="hidden" multiple>
      <div class="editor"></div>
    </div>

    <div class='form-control' style="display : none;"> 
      <input name="time" type="date" value="${new Date().toISOString().split('T')[0]}" >
    </div>

    <div class='form-control' style="display : none;"> 
      <input name="idplace" type="text" value="${idPlace}" >
    </div>

    <div class='form-control' style="display : none;"> 
      <input name="idad" type="text" value="${idAd}" >
    </div>

    <div class='form-control' style="display : none;"> 
      <input name="status" type="text" value="0" >
    </div>

    <div class="capcha flex center">
    <div class="checkbox-wrapper-44">
    <label class="toggleButton">
    <input type="checkbox" value="false" onclick="changeValueAndDisable(this)">
      <div>
        <svg viewBox="0 0 44 44">
          <path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path>
          </svg>
          </div>
        </label>
      </div>
      <div>Tôi không phải là Robot</div>
    </div>

    <button class="btn btn-primary submit-form" disabled type="submit">Gửi Báo Cáo</button>
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

    quill.on('editor-change', function (eventName, ...args) {
        if (eventName === 'text-change') {
            var blocks = quill.getContents().ops;

            var imageCount = blocks.reduce(function (count, block) {
                if (block.insert && block.insert.image) {
                    return count + 1;
                }
                return count;
            }, 0);

            handleChangeInput({ name: 'about' }, imageCount)
        }
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
        if (document.querySelector(".display_name").classList.contains("active") || document.querySelector(".phone_number").classList.contains("active") || document.querySelector(".edit").classList.contains("active")) {
            alert("Vui lòng nhập đúng thông tin")
            return;
        }
        else {
            const formId = await getMaxFormId()
            const formdata = $(form).serializeArray();
            var formData = new FormData();
            formData.append("name", formdata[0].value);
            formData.append("time", formdata[5].value);
            formData.append("email", formdata[1].value);
            formData.append("phone", formdata[2].value);
            formData.append("address", formdata[3].value);
            formData.append("idplace", formdata[6].value);
            formData.append("idad", formdata[7].value);
            formData.append("image", quill.getContents().ops.filter((about) => about.insert.image).map((about) => about.insert.image));
            formData.append("context", quill.getContents().ops.filter((about) => !about.insert.image).map((about) => about.insert));
            // await fetch('https://server-ptudw.onrender.com/api/report', {
            //     method: 'POST',
            //     body: formData,
            // })
            await fetch('http://localhost:5000/api/report', {
                method: 'POST',
                body: formData,
            })

            const filteredData = formdata.filter(item => {
                const allowedNames = ['display_name', 'email', 'phone_number', 'location', 'time'];
                return allowedNames.includes(item.name);
            });

            console.log(filteredData)
            localStorage.setItem(formId, JSON.stringify(filteredData));
            back()
        }
    };

}

window.handleReport = function (address, idPlace, idAd) {
    createReportForm(address, idPlace, idAd)
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
    $("#report_container").removeClass("active");
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
    var loadingIcon = searchDiv.querySelector('.loading');
    const address = inputField.value;

    if (inputField.value === '') {
        inputField.focus();
    } else {
        try {
            loadingIcon.classList.add('active');
            const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + address);
            const data = await response.json();

            if (data.length > 0) {
                var result = data[0];
                var lat = result.lat;
                var lon = result.lon;
                var marker = L.marker([lat, lon]).addTo(map);
                clickMarkerLayer.clearLayers();
                clickMarkerLayer.addLayer(marker);
                map.panTo([lat, lon]);
                loadingIcon.classList.remove('active');
            } else {
                alert('Không tìm thấy địa chỉ');
                loadingIcon.classList.remove('active');
            }
        } catch (error) {
            console.error('Error:', error);
            loadingIcon.classList.remove('active');
        }
    }
}

window.changeValueAndDisable = function (checkbox) {
    if (checkbox.checked) {
        checkbox.value = 'true';
        checkbox.disabled = true;
        document.querySelector('.submit-form').disabled = false;
    }
}

window.handleChangeInput = function (input, imageCount) {
    if (input.name === 'display_name') {
        if (input.value.length > 50) {
            document.querySelector('.label.display_name').classList.add('active');
        } else {
            document.querySelector('.label.display_name').classList.remove('active');
        }
    } else if (input.name === 'phone_number') {
        if (!input.value.match(/^[0-9]+$/) || input.value.length < 10 || input.value.length > 11) {
            document.querySelector('.label.phone_number').classList.add('active');
        } else {
            document.querySelector('.label.phone_number').classList.remove('active');
        }
    } else if (input.name === 'email') {
        if (!input.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            document.querySelector('.label.email').classList.add('active');
        } else {
            document.querySelector('.label.email').classList.remove('active');
        }
    }
    else if (input.name === 'about') {
        if (imageCount > 2) {
            document.querySelector('.label.edit').classList.add('active');
        } else {
            document.querySelector('.label.edit').classList.remove('active');
        }
    }
}

window.handleClickReport = function () {
    $("#info_container").removeClass("active");
    $("#form_container").removeClass("active");
    $("#report_container").addClass("active");

    function readFormData(startsWith) {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(startsWith))
            .reduce((formData, key) => {
                const jsonString = localStorage.getItem(key);
                formData[key] = JSON.parse(jsonString);
                return formData;
            }, {});
    }

    var formDataObjectFromLocalStorage = readFormData("form");

    $("#report_container").html("");
    for (let [key, value] of Object.entries(formDataObjectFromLocalStorage)) {
        $("#report_container").append(`
    <div class="report">
      <div><strong>Tên người gửi: </strong>${value[0].value}</div>
      <div><strong>Email đã dùng: </strong>${value[1].value}</div>
      <div><strong>Số ĐT đã dùng: </strong>${value[2].value}</div>
      <div><strong>Địa chỉ nơi báo cáo: </strong>${value[3].value}</div>
      <div><strong>Thời gian gửi: </strong>${value[4].value}</div>
    </div>`);
    }
}
