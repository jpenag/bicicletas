import React, {Component} from "react";
import ReactDataGrid from 'react-data-grid';
import { withRouter } from "react-router";
import { Button,Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, Marker, Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import $ from 'jquery';

toast.configure();

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class Alquiler extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
        response: '',
        post: '',
        responseToPost: '',
        showModal:false,
        markers: []
        };
    }

    componentDidMount() {
        this.listarBicicletas()
        .then(res => {
            this.setState({ response: res.datos });
        })
        .catch(err => console.log(err));

        this.listarBicicletasGeo()
            .then(res => {
                const markers = this.state.markers;
                $(res.datos).each(function() {
                    if(this.alquiler.length > 0) {
                        markers.push([this.latitud, this.longitud, this.id, this.color, this.modelo, this.alquiler[0].nombre, this.alquiler[0].identificacion]);
                    }
                });
                this.setState({ markers: markers});
            })
            .catch(err => console.log(err));
    }

    listarBicicletasGeo = async () => {
        const response = await fetch('/apiGeo/listarBicicletasGeo');
        const body = await response.json(); 
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    listarBicicletas = async () => {
        const response = await fetch('/api/listarBicicletasAlquiler');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    getBicileta = async (id) => {
        const response = await fetch('/api/bicicleta/' + id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    nuevoAqluiler = async (id, nombre, identificacion) => {
    
        var myobj = { bicicleta_id: parseInt(id), nombre: nombre, identificacion: identificacion };
        const response = await fetch('/api/crearAlquiler', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: myobj }),
        });
        const body = await response.json();
        
        if (response.status !== 200) throw Error(body.message);

        if(body.datos.success){
        toast.success("Ha alquilado la bicicleta exitosamente!", {
            position: toast.POSITION.BOTTOM_RIGHT
        });
        this.handleModal();
        this.listarBicicletas()
            .then(res => {
                this.setState({ response: res.datos });
                const markers = [];
                $(res.datos).each(function() {
                    if(this.alquiler.length > 0) {
                        markers.push([this.latitud, this.longitud, this.id, this.color, this.modelo, this.alquiler[0].nombre, this.alquiler[0].identificacion]);
                    }
                });
                this.setState({ markers: markers});
            })
            .catch(err => console.log(err));
        }
        else
        {
        console.log('error');
        }
    };

    regresarBicileta = async (id) => {
        const response = await fetch('/api/regresarBicicleta/' + id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if(body.datos.success){
        toast.success("Se ha regresado exitosamente la bicicleta!", {
            position: toast.POSITION.BOTTOM_RIGHT
        });
        this.listarBicicletas()
            .then(res => {
                this.setState({ response: res.datos });
                const markers = [];
                $(res.datos).each(function() {
                    if(this.alquiler.length > 0) {
                        markers.push([this.latitud, this.longitud, this.id, this.color, this.modelo, this.alquiler[0].nombre, this.alquiler[0].identificacion]);
                    }
                });
                this.setState({ markers: markers});
            })
            .catch(err => console.log(err));
        }
        else
        {
        console.log('error');
        }
    };
    
    alquilarPopupBicileta = (id) => {
        this.getBicileta(id)
            .then(res => {
            $('#txtId').prop( "disabled", true );
            $('#txtId').val(res.datos.id);
            $('#txtColor').prop( "disabled", true );
            $('#txtColor').val(res.datos.color);
            $('#txtModelo').prop( "disabled", true );
            $('#txtModelo').val(res.datos.modelo);
            $('#txtLatitud').prop( "disabled", true );
            $('#txtLatitud').val(res.datos.latitud);
            $('#txtLongitud').prop( "disabled", true );
            $('#txtLongitud').val(res.datos.longitud);
            })
            .catch(err => console.log(err));

        this.handleModal();
        setTimeout(() => {
        $('#txtId').trigger('focus');
        }, 50); 
    }

    handleModal () {  
        this.setState({showModal:!this.state.showModal})  
    }

    alquilar () {
        var id = $('#txtId').val();
        var nombre = $('#txtNombre').val();
        var identificacion = $('#txtIdentificacion').val();

        this.nuevoAqluiler(id, nombre, identificacion);
    }

    render() {
        const styleMap = { "width": "100%", "height": "60vh" };
        const BotonesFormatter = ( cellvalue ) => {
            
            if(cellvalue.row.alquiler.length === 0)
                return <button onClick={this.alquilarPopupBicileta.bind(this, cellvalue.row.id)} type="button" className="btn btn-dark" style={{ paddingLeft: '3px', paddingRight: '3px', paddingTop: '1px', paddingBottom: '1px' }}>Alquilar</button>;
            else
                return <button onClick={this.regresarBicileta.bind(this, cellvalue.row.id)} type="button" className="btn btn-dark" style={{ paddingLeft: '3px', paddingRight: '3px', paddingTop: '1px', paddingBottom: '1px' }}>Regresar</button>;
        };
        const columns = [
        { key: 'id', name: 'Id' },
        { key: 'color', name: 'Color' },
        { key: 'modelo', name: 'Modelo' },
        { key: 'latitud', name: 'Latitud' },
        { key: 'longitud', name: 'Longitud' },
        { key: '', name: ' ', formatter: BotonesFormatter }
        ];

        return (
            <div className="container" style={{ padding: 0, marginTop: '25px', width: '100%', maxWidth: '100%' }}>
                <div className="row" style={{ marginRight: '0px' }}>
                    <div className="col-2"></div>
                    <div className="col-8">
                        <ReactDataGrid 
                        minHeight={-1}
                        columns = {columns} 
                        rows = {this.state.response} />
                    </div>
                </div>
                <div className="container" style={{ padding: 0, margin: 0, width: '100%', maxWidth: '100%' }}>
                    <div className="row" style={{ marginRight: '0px' }}>
                        <div className="col-2"></div>
                        <div className="col-8">&nbsp;</div>
                    </div>
                    <div className="row" style={{ marginRight: '0px' }}>
                        <div className="col-2"></div>
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
                                        <b>Nombre:</b> {position[5]}<br />
                                        <b>Identificación:</b> {position[6]}<br />
                                    </Tooltip>
                                    </Marker>
                                )}
                            </MapContainer><br /><br /><br /><br /><br /><br />
                        </div>
                    </div>
                </div>
                <Modal show={this.state.showModal} onHide={()=>this.handleModal()}>
                    <Modal.Header closeButton>Alquilar bicicleta</Modal.Header>
                    <Modal.Body>
                    <form>
                        <div className="form-group">
                        <label>Id</label>
                        <input className="form-control" id="txtId" placeholder="" />
                        </div>
                        <div className="form-group">
                        <label>Color</label>
                        <input className="form-control" id="txtColor" placeholder="" />
                        </div>
                        <div className="form-group">
                        <label>Modelo</label>
                        <input className="form-control" id="txtModelo" placeholder="" />
                        </div>
                        <div className="form-group">
                        <label>Latitud</label>
                        <input className="form-control" id="txtLatitud" placeholder="" />
                        </div>
                        <div className="form-group">
                        <label>Longitud</label>
                        <input className="form-control" id="txtLongitud" placeholder="" />
                        </div>
                        <div className="form-group">
                        <label>Nombre completo</label>
                        <input className="form-control" id="txtNombre" placeholder="" />
                        </div>
                        <div className="form-group">
                        <label>Nro de Identificación</label>
                        <input className="form-control" id="txtIdentificacion" placeholder="" />
                        </div>
                    </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={()=>this.handleModal()} className="btn btn-dark">Cerrar</Button>
                    <Button onClick={()=>this.alquilar()} className="btn btn-dark">Alquilar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Alquiler);