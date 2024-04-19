import React from "react";
import Modal from "simple-react-modal";

function Ballotingmodel({ showModal, onClose }) {
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
    >
      <div>class jbibi</div>
    </Modal>
  );
}

export default Ballotingmodel;
