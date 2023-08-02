import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';

const ModalContent = styled.div`
  padding: 20px;
`;

const AddProductModal = ({ show, onHide }) => {
  const [img, setImg] = useState([]); // To store selected image files
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [sizes, setSizes] = useState(['']);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const handleAddSize = () => {
    if (sizes.length < 5) {
      setSizes([...sizes, '']);
    }
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data = {
      img,
      productName,
      brandName,
      desc,
      price,
      inStock,
      sizes,
      category,
    };
  };

  const handleImageChange = (e, index) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Use FileReader to read the selected file and get its base64 data
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...images];
        updatedImages[index] = reader.result;
        setImg(updatedImages);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalContent>
          <Form.Group>
            <Form.Label>Product Images</Form.Label>
            {images.map((imageData, index) => (
              <div key={index}>
                {imageData && <img src={imageData} alt={`Image ${index}`} />}
                <Form.Control
                  type='file'
                  onChange={(e) => handleImageChange(e, index)}
                  accept='image/*'
                />
              </div>
            ))}
            <button onClick={() => setImages([...images, ''])}>
              Add Image
            </button>
          </Form.Group>
          <Form.Group>
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type='text'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder='Product Name'
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Brand Name</Form.Label>
            <Form.Control
              as='select'
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            >
              <option value=''>Select Brand</option>
              {/* Populate the options with data from backend */}
              <option value='Zoro'>Zoro</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as='textarea'
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder='Product Description'
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='text'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='Price'
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type='checkbox'
              label='In Stock'
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Available Sizes</Form.Label>
            {sizes.map((size, index) => (
              <div key={index} className='d-flex align-items-center'>
                <Form.Control
                  type='text'
                  value={size}
                  onChange={(e) => {
                    const updatedSizes = [...sizes];
                    updatedSizes[index] = e.target.value;
                    setSizes(updatedSizes);
                  }}
                  placeholder={`Size ${index + 1}`}
                />
                <Button
                  variant='danger'
                  className='ml-2'
                  onClick={() => handleRemoveSize(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant='secondary' onClick={handleAddSize}>
              Add Size
            </Button>
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as='select'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=''>Select Category</option>
              {/* Populate the options with data from backend */}
              <option value='Clothing'>Clothing</option>
              <option value='Skirts'>Skirts</option>
            </Form.Control>
          </Form.Group>
        </ModalContent>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Close
        </Button>
        <Button variant='primary' onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProductModal;
