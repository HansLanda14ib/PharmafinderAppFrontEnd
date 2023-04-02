
import Modal from "react-modal";

Modal.setAppElement("#root");

function ConfirmationModal({ isOpen, onRequestClose, onConfirm, onCancel, message }) {
    const handleConfirm = () => {
        onConfirm();
        onRequestClose();
    };

    const handleCancel = () => {
        onCancel();
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                content: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "fit-content",
                    maxWidth: "80%",
                    padding: "20px",
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
            }}
        >
            <h2>{message}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <button onClick={handleConfirm} className="btn btn-primary">
                    Yes
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                    No
                </button>
            </div>
        </Modal>
    );
}

export default ConfirmationModal;
