import React, {Component} from "react";
import logo from '../images/logo.png';
import { MapContainer, TileLayer, Marker, Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { withRouter } from "react-router";
import $ from 'jquery';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class Home extends Component {

  constructor(props) {
      super(props)
      this.state = {
        isLogin: false,
        userData: '',
        markers: []
      }
  }

  componentDidMount() {
      const userData = sessionStorage.getItem("userData");
      const user = JSON.parse(userData);
      if (userData) {
          this.setState({ isLogin: true });
          this.setState({ userData: user.name });

          this.listarBicicletas()
            .then(res => {
              this.setState({ response: res.datos });
            })
            .catch(err => console.log(err));

          this.listarBicicletasGeo()
            .then(res => {
              const markers = this.state.markers;
              $(res.datos).each(function() {
                markers.push([this.latitud, this.longitud, this.id, this.color, this.modelo]);
              });
              this.setState({ markers: markers});
            })
            .catch(err => console.log(err));
      }
      else
        this.props.history.push("/");
  }

  listarBicicletasGeo = async () => {
    const response = await fetch('/apiGeo/listarBicicletasGeo');
    const body = await response.json(); 
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  listarBicicletas = async () => {
    const response = await fetch('/api/listarBicicletas');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

    
  render() {
    const styleMap = { "width": "100%", "height": "60vh" };
    return (
      <div className="App">
        <br />
        <img src={logo} className="App-logo" alt="logo" />
        <br /><br /><br />
        <div className="container" style={{ padding: 0, margin: 0, width: '100%', maxWidth: '100%' }}>
          <div className="row" style={{ marginRight: '0px' }}>
          <div className="col-2">
            </div>
            <div className="col-8">
              <MapContainer style={styleMap} className="markercluster-map" center={[4.0, -74.0]} zoom={7} maxZoom={18}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                {this.state.markers.map((position, idx) =>
                    <Marker key={`marker-${idx}`} position={[position[0],position[1]]}>
                      <Tooltip>
                        <b>Código:</b> {position[2]}<br />
                        <b>Color:</b> {position[3]}<br />
                        <b>Modelo:</b> {position[4]}<br />
                        <b>Lat:</b> {position[0]}<br />
                        <b>Lon:</b> {position[1]}<br />
                      </Tooltip>
                    </Marker>
                )}
              </MapContainer>
              <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
                <div className="col-4" style={{ textAlign: 'left', marginTop: '5px' }}>
                  <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#dfdfdf', padding: '10px', borderRadius: '10px' }}>
                    <h3>Paseos</h3>
                    <p style={{ lineHeight: '1.2', fontSize: '12px', textAlign: 'justify' }}>Son paseos programados, donde podras compartir con amigos y hacer nuevos</p>
                    <div style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderColor: '#dfdfdf', paddingTop: '5px' }}>
                      <button type="button" className="btn btn-dark">Más info</button>
                    </div>
                  </div>
                </div>
                <div className="col-4" style={{ textAlign: 'left', marginTop: '5px' }}>
                  <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#dfdfdf', padding: '10px', borderRadius: '10px' }}>
                    <h3>Rutas</h3>
                    <p style={{ lineHeight: '1.2', fontSize: '12px', textAlign: 'justify' }}>Los Fines de semana haremos ruta con al menos 120 KM de recorrido, Animate!!</p>
                    <div style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderColor: '#dfdfdf', paddingTop: '5px' }}>
                      <button type="button" className="btn btn-dark">Más info</button>
                    </div>
                  </div>
                </div>
                <div className="col-4" style={{ textAlign: 'left', marginTop: '5px' }}>
                  <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#dfdfdf', padding: '10px', borderRadius: '10px' }}>
                    <h3>Competencias!!</h3>
                    <p style={{ lineHeight: '1.2', fontSize: '12px', textAlign: 'justify' }}>Las competencias nacionales son la cuspide, animate a ser un profesional en nuestro Club.</p>
                    <div style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderColor: '#dfdfdf', paddingTop: '5px' }}>
                      <button type="button" className="btn btn-dark">Más info</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default withRouter(Home);