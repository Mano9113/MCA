import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from "../config.json";  
import Axios from "axios";

const ModalExample = () => {
  // State to hold form values
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    date: '',
    kannada: '',
    english: '',
    physics: '',
    chemistry: '',
    mathematics: '',
    biology: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Submit the form data to the API
  const handleSubmit = async () => {
    console.log(formData); // Debugging log
  
    try {
      const response = await Axios.post(`${config.backendUrl}/addStudentsMarks`, formData);
  
      if (response.status === 200) { // Axios uses 'status' for HTTP codes
        console.log('Data submitted successfully!', response.data);

        // Show success toast
        toast.success('Data inserted successfully!');

        // Close the modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        // Clear the form
        setFormData({
          name: '',
          class: '',
          date: '',
          kannada: '',
          english: '',
          physics: '',
          chemistry: '',
          mathematics: '',
          biology: '',
        });
      } else {
        console.error('Error submitting data:', response.data);
        toast.error('Error submitting data!');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error('Error submitting data!');
    }
  };
  

  return (
    <div>
      <ToastContainer /> {/* Toast container for notifications */}
      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Add List</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                {Object.keys(formData).map((key) => (
                  <div className="mb-1" key={key}>
                    <label htmlFor={key} className="col-form-label">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </label>
                    <input
                      type={key === 'date' ? 'date' : key === 'name' || key === 'class' ? 'text' : 'number'}
                      className="form-control"
                      id={key}
                      value={formData[key]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalExample;
