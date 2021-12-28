import ReactMapGL, { Source, Layer, Popup } from "react-map-gl";
import { useEffect, useState } from "react";

export default function App() {
  const [viewport, setViewport] = useState({
    longitude: 77.74495913453232,
    latitude: 12.993406628665984,
    zoom: 10,
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [areas, setAreas] = useState();
  const [users, setUsers] = useState();
  const [showPopup, togglePopup] = useState(false);
  const [popData, setPopData] = useState(null);

  function getDetails(area_id) {
    let male = 0;
    let female = 0;
    let pro_users = 0;
    let total_users = 0;

    users.forEach((element) => {
      if (element.area_id === area_id) {
        if (element.gender === "M") {
          male++;
        } else {
          female++;
        }
        if (element.is_pro_user === true) {
          pro_users++;
        }
        total_users++;
      }
    });

    return {
      male,
      female,
      pro_users,
      total_users
    };
  }

  useEffect(() => {
    (async function () {
      await fetch("https://kyupid-api.vercel.app/api/areas")
        .then((res) => res.json())
        .then((new_areas) => setAreas(new_areas));
    })();
    (async function () {
      await fetch("https://kyupid-api.vercel.app/api/users")
        .then((res) => res.json())
        .then((new_users) => setUsers(new_users.users));
    })();
  }, []);

  const layerStyle = {
    id: "area",
    type: "fill",
    paint: {
      "fill-color": "#00ffff",
      "fill-opacity": 0.7,
      "fill-outline-color": "#ff0000"
    }
  };

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(newviewport) => setViewport(newviewport)}
      mapStyle={"mapbox://styles/mapbox/basic-v9"}
      mapboxApiAccessToken={
        "pk.eyJ1Ijoibml0ZXNoc2g0cm1hIiwiYSI6ImNreHE4ZzJzdDFlYjMycHA3bXphYno3emcifQ.G690vt5K8bxhpPpyGLOEMA"
      }
      onClick={(e) => {
        if (e.features.length > 0) {
          const userdata = getDetails(e.features[0].properties.area_id);
          setPopData({
            longitude: e.lngLat[0],
            latitude: e.lngLat[1],
            data: {
              name: e.features[0].properties.name,
              area_id: e.features[0].properties.area_id,
              pin_code: e.features[0].properties.pin_code,
              users: userdata
            }
          });

          togglePopup(true);
        }
      }}
    >
      {areas && (
        <Source id="my-data" type="geojson" data={areas}>
          <Layer {...layerStyle} />
          {showPopup && (
            <Popup
              latitude={popData.latitude}
              longitude={popData.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => togglePopup(false)}
              anchor="top"
            >
              <div>{`${popData.data.name}`}</div>
              <div>{`Male - ${popData.data.users.male}`}</div>
              <div>{`Female - ${popData.data.users.female}`}</div>
              <div>{`Pro Users - ${popData.data.users.pro_users}`}</div>
              <div>{`Total Users - ${popData.data.users.total_users}`}</div>
            </Popup>
          )}
        </Source>
      )}
    </ReactMapGL>
  );
}
