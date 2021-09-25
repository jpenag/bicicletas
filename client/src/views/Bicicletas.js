import React, {Component} from "react";
import ReactDataGrid from 'react-data-grid';
import { withRouter } from "react-router";
import { Button,Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';

toast.configure();

class Bicicletas extends Component {
    
  constructor(props) {
    super(props)
    this.state = {
      response: '',
      post: '',
      responseToPost: '',
      login: false,
      nombreUsuario: '',
      showModal:false,
      nuevo: false
    };
  }

  componentDidMount() {
    const userData = sessionStorage.getItem("userData");
    const user = JSON.parse(userData);
    if (userData) {
      this.setState({ isLogin: true });
      this.setState({ userData: user.name });
      
      this.listarBicicletas()
        .then(res => this.setState({ response: res.datos }))
        .catch(err => console.log(err));
        
    }
    else
      this.props.history.push("/");
  }

  listarBicicletas = async () => {
    const response = await fetch('/api/listarBicicletas');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  borrarBicileta = async (id) => {
    const response = await fetch('/api/borrarBicicleta/' + id);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    if(body.datos.success){
      toast.success("Se ha eliminado exitosamente el registro!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      this.listarBicicletas()
        .then(res => this.setState({ response: res.datos }))
        .catch(err => console.log(err));
    }
    else
    {
      console.log('error');
    }
  };

  getBicileta = async (id) => {
    const response = await fetch('/api/bicicleta/' + id);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  editarBicicleta = async (id, color, modelo, latitud, longitud) => {
    
    var myobj = { id: parseInt(id), color: color, modelo: modelo, longitud: parseFloat(longitud), latitud: parseFloat(latitud) };
    const response = await fetch('/api/editarBicicleta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: myobj }),
    });
    const body = await response.json();
    
    if (response.status !== 200) throw Error(body.message);

    if(body.datos.success){
      toast.success("Se ha editado exitosamente la bicicleta!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      this.handleModal();
      this.listarBicicletas()
        .then(res => this.setState({ response: res.datos }))
        .catch(err => console.log(err));
    }
    else
    {
      console.log('error');
    }
  };

  nuevaBicicleta = async (id, color, modelo, latitud, longitud) => {
    
    var myobj = { id: parseInt(id), color: color, modelo: modelo, longitud: parseFloat(longitud), latitud: parseFloat(latitud) };
    const response = await fetch('/api/crearBicicleta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: myobj }),
    });
    const body = await response.json();
    
    if (response.status !== 200) throw Error(body.message);

    if(body.datos.success){
      toast.success("Se ha creado exitosamente la bicicleta!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      this.handleModal();
      this.listarBicicletas()
        .then(res => this.setState({ response: res.datos }))
        .catch(err => console.log(err));
    }
    else
    {
      console.log('error');
    }
  };

  editarPopupBicileta = (id) => {
    this.setState({ nuevo: false });
    this.getBicileta(id)
        .then(res => {
          $('#txtId').prop( "disabled", true );
          $('#txtId').val(res.datos.id);
          $('#ddlColor').val(res.datos.color);
          $('#ddlModelo').val(res.datos.modelo);
          $('#txtLatitud').val(res.datos.latitud);
          $('#txtLongitud').val(res.datos.longitud);
        })
        .catch(err => console.log(err));

    this.handleModal();
  };

  nuevo = () => {
    this.setState({ nuevo: true })
    this.handleModal();
    setTimeout(() => {
      $('#txtId').trigger('focus');
    }, 50); 
  }

  handleModal () {  
    this.setState({showModal:!this.state.showModal})  
  }

  guardar () {
    var id = $('#txtId').val();
    var color = $('#ddlColor').val();
    var modelo = $('#ddlModelo').val();
    var lati = $('#txtLatitud').val();
    var long = $('#txtLongitud').val();

    if (this.state.nuevo) {
      this.nuevaBicicleta(id, color, modelo, lati, long);
    }
    else {
      this.editarBicicleta(id, color, modelo, lati, long);
    }
  }

  render() {
    const BotonesFormatter = ( cellvalue ) => {
      return (<div><button onClick={this.borrarBicileta.bind(this, cellvalue.row.id)} type="button" className="btn btn-dark" style={{ paddingLeft: '3px', paddingRight: '3px', paddingTop: '1px', paddingBottom: '1px' }}>Eliminar</button>&nbsp;&nbsp;
      <button onClick={this.editarPopupBicileta.bind(this, cellvalue.row.id)} type="button" className="btn btn-dark" style={{ paddingLeft: '3px', paddingRight: '3px', paddingTop: '1px', paddingBottom: '1px' }}>Editar</button></div>);
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
            <Button onClick={()=>this.nuevo()} className="btn btn-dark">Nuevo</Button>
          </div>
        </div>
        <div className="row" style={{ marginRight: '0px' }}>
          <div className="col-2"></div>
          <div className="col-8">&nbsp;</div>
        </div>
        <div className="row" style={{ marginRight: '0px' }}>
          <div className="col-2"></div>
            <div className="col-8">
              <ReactDataGrid 
              columns = {columns} 
              rows = {this.state.response} />
            </div>
          </div>
          <Modal show={this.state.showModal} onHide={()=>this.handleModal()} size="sm">
            <Modal.Header closeButton>Editar registro</Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label>Id</label>
                  <input className="form-control" id="txtId" placeholder="" />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <select id="ddlColor" class="form-select">
                  <option selected></option>
                    <option value="Negro">Negro</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Amarillo">Amarillo</option>
                    <option value="Verde">Verde</option>
                    <option value="Rojo">Rojo</option>
                    <option value="Naranjado">Naranjado</option>
                    <option value="Morado">Morado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Modelo</label>
                  <select id="ddlModelo" class="form-select">
                    <option selected></option>
                    <option value="Cross">Cross</option>
                    <option value="Montaña">Montaña</option>
                    <option value="Ruta">Ruta</option>
                    <option value="Urbana">Urbana</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Latitud</label>
                  <input className="form-control" id="txtLatitud" placeholder="" />
                </div>
                <div className="form-group">
                  <label>Longitud</label>
                  <input className="form-control" id="txtLongitud" placeholder="" />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={()=>this.handleModal()} className="btn btn-dark">Cerrar</Button>
              <Button onClick={()=>this.guardar()} className="btn btn-dark">Guardar</Button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default withRouter(Bicicletas);