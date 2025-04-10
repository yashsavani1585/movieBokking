import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  FloatingLabel
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddShow.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
  baseURL: 'https://localhost:7005'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const AddShow = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    movieId: '',
    movieName: '',
    price: '',
    showTime: new Date(),
    theaterId: '',
    theaterName: '',
    ticketsRemaining: 100,
    moviePosterFile: null,
    theaterImageFile: null
  });

  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState({ form: false, movies: true, theaters: true });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatersRes] = await Promise.all([
          api.get('/api/Movie'),
          api.get('/api/Theater')
        ]);
        setMovies(moviesRes.data);
        setTheaters(theatersRes.data);
        setLoading(prev => ({ ...prev, movies: false, theaters: false }));
      } catch (err) {
        setError('Failed to load movie or theater data. Please try again later.');
        setLoading(prev => ({ ...prev, movies: false, theaters: false }));
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'movieId') {
      const selectedMovie = movies.find(movie => movie.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        movieId: value,
        movieName: selectedMovie ? selectedMovie.name : ''
      }));
    } else if (name === 'theaterId') {
      const selectedTheater = theaters.find(theater => theater.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        theaterId: value,
        theaterName: selectedTheater ? selectedTheater.name : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.movieId) {
      errors.movieId = 'Please select a movie';
      isValid = false;
    }
    if (!formData.theaterId) {
      errors.theaterId = 'Please select a theater';
      isValid = false;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Please enter a valid price';
      isValid = false;
    }
    if (!formData.showTime || new Date(formData.showTime) < new Date()) {
      errors.showTime = 'Please select a valid future date and time';
      isValid = false;
    }
    if (!formData.ticketsRemaining || parseInt(formData.ticketsRemaining) <= 0) {
      errors.ticketsRemaining = 'Please enter a valid number of tickets';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(prev => ({ ...prev, form: true }));

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('MovieId', formData.movieId);
      formDataToSend.append('MovieName', formData.movieName);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('ShowTime', formData.showTime.toISOString());
      formDataToSend.append('TheaterId', formData.theaterId);
      formDataToSend.append('TheaterName', formData.theaterName);
      formDataToSend.append('TicketsRemaining', formData.ticketsRemaining);

      if (formData.moviePosterFile) {
        formDataToSend.append('MoviePosterFile', formData.moviePosterFile);
      }
      if (formData.theaterImageFile) {
        formDataToSend.append('TheaterImageFile', formData.theaterImageFile);
      }

      await api.post('/api/Show', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Show added successfully!');
      setTimeout(() => navigate('/shows'), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const serverErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          serverErrors[key] = value.join(' ');
        });
        setValidationErrors(serverErrors);
      } else {
        setError(err.response?.data?.message || 'Failed to add show. Please try again.');
      }
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={8} lg={10} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white py-3">
              <h3 className="mb-0 text-center">Add New Show</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-4">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    {/* Movie Select */}
                    <FloatingLabel controlId="movieId" label="Movie *" className="mb-3">
                      {loading.movies ? (
                        <div className="d-flex align-items-center py-2">
                          <Spinner animation="border" size="sm" className="me-2" />
                          <span>Loading movies...</span>
                        </div>
                      ) : (
                        <>
                          <Form.Select
                            name="movieId"
                            value={formData.movieId}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.movieId}
                            className="py-3"
                          >
                            <option value="">Select a movie</option>
                            {movies.map(movie => (
                              <option key={movie.id} value={movie.id}>{movie.name}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {validationErrors.movieId}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </FloatingLabel>

                    {/* Price */}
                    <FloatingLabel controlId="price" label="Price *" className="mb-3">
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        isInvalid={!!validationErrors.price}
                        className="py-3"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.price}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    {/* Show Time */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Show Time *</Form.Label>
                      <DatePicker
                        selected={formData.showTime}
                        onChange={(date) => setFormData(prev => ({ ...prev, showTime: date }))}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className={`form-control py-2 ${validationErrors.showTime ? 'is-invalid' : ''}`}
                        minDate={new Date()}
                        wrapperClassName="w-100"
                      />
                      {validationErrors.showTime && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.showTime}
                        </div>
                      )}
                    </Form.Group>

                    {/* Movie Poster */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Movie Poster (optional)</Form.Label>
                      <Form.Control
                        type="file"
                        name="moviePosterFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    {/* Theater Select */}
                    <FloatingLabel controlId="theaterId" label="Theater *" className="mb-3">
                      {loading.theaters ? (
                        <div className="d-flex align-items-center py-2">
                          <Spinner animation="border" size="sm" className="me-2" />
                          <span>Loading theaters...</span>
                        </div>
                      ) : (
                        <>
                          <Form.Select
                            name="theaterId"
                            value={formData.theaterId}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.theaterId}
                            className="py-3"
                          >
                            <option value="">Select a theater</option>
                            {theaters.map(theater => (
                              <option key={theater.id} value={theater.id}>{theater.name}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {validationErrors.theaterId}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </FloatingLabel>

                    {/* Tickets Remaining */}
                    <FloatingLabel controlId="ticketsRemaining" label="Tickets Available *" className="mb-3">
                      <Form.Control
                        type="number"
                        name="ticketsRemaining"
                        value={formData.ticketsRemaining}
                        onChange={handleChange}
                        min="1"
                        isInvalid={!!validationErrors.ticketsRemaining}
                        className="py-3"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.ticketsRemaining}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    {/* Theater Image */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Theater Image (optional)</Form.Label>
                      <Form.Control
                        type="file"
                        name="theaterImageFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading.form}
                    className="px-4 py-2"
                  >
                    {loading.form ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      'Add Show'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddShow;
