let xhr = new XMLHttpRequest();

var requestData = [];
var lastUpdate; 

// TODO: add button to update stok
window.onload = () => {
  setNavbar();
  if (!getCookie('sessionID')) {
    window.location.href = '../login/';
  }

  getRequests();
};

const getRequests = () => {
  let url = '../../../backend/api/request.php';

  xhr.open('GET', url);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(this.responseText);
      if (response.statusCode === 200) {
        requestData = response.data;
        lastUpdate = response.lastUpdate;
        
        document.getElementById('last-update').innerHTML = "Last Updated: " + lastUpdate;
        setRequestTable(requestData);
      }
    } else {
      console.log(this);
    }
  };

  xhr.send();
};

const getDorayakiName = (id, cell) => {
  let url = `../../../backend/api/detail-dorayaki.php?id_dorayaki=${id}`

  xhr.open('GET', url, false);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(this.response);
      if (response.statusCode === 200) {
        cell.innerHTML = response.data.dorayaki_name;
      }
    } else {
      console.log(this);
    }
  }

  xhr.send();
}

const setRequestTable = (data) => {
  let requestsBody = document.getElementById('requests');

  data.filter((val) => {
    return val.status === 'not validated' || (val.status === 'accepted' && (new Date(val.createdAt)).getTime() > date.getTime());
  }).forEach((request) => {
    let row = document.createElement('tr');

    let dorayaki = document.createElement('td');
    let dateRequest = document.createElement('td');
    let dateAccept = document.createElement('td');
    let num = document.createElement('td');
    let status = document.createElement('td');

    getDorayakiName(request.idDorayaki, dorayaki);
    let tempDate = (request.createdAt).split('.')[0].split('T');
    dateRequest.innerHTML = tempDate[0] + ' ' + tempDate[1];
    // tempDate = (request.updatedAt).split('.')[0].split('T');
    dateAccept.innerHTML = request.status === 'not validated' ? '-' : tempDate[0] + ' ' + tempDate[1];
    num.innerHTML = request.stokAdded;
    status.innerHTML = request.status;

    row.appendChild(dorayaki);
    row.appendChild(dateRequest);
    row.appendChild(dateAccept);
    row.appendChild(num);
    row.appendChild(status);

    requestsBody.appendChild(row);
  });
};

const restock = () => {
  date = new Date(lastUpdate);
  console.log(date);

  let newStock = {};

  requestData.filter((val) => {
    return val.status === 'accepted' && (new Date(val.createdAt)).getTime() > date.getTime(); 
  }).forEach((val) => {
    newStock[val.idDorayaki] = val.stokAdded;
  });

  xhr.open('PUT', '../../../backend/api/stock.php');
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(this.response);
      if (response.statusCode === 200) {
        console.log(response);
      }
    }
  }

  newStock && xhr.send(JSON.stringify(newStock));
}
