import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  sm: { maxWidth: 450 },
  md: { maxWidth: 500 },
  border: "2px solid transparent",
  borderRadius: 7,
};

const AuthModel = ({ handleClose, open }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => setIsRegistering((prev) => !prev);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setIsRegistering(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="bg-white px-1 pb-2 pt-1 ">
        {isRegistering ? <Register /> : <Login />}
        <div className="text-center mt-3 sm:mt-4 text-xs sm:text-sm">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 underline font-bold cursor-pointer"
                onClick={toggleForm}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 underline font-bold cursor-pointer"
                onClick={toggleForm}
              >
                Register
              </button>
            </>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default AuthModel;
