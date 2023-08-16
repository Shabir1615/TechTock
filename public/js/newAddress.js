
addressForm.addEventListener("submit", async function (event) {
    const addressForm = document.getElementById("addressForm");
  
    event.preventDefault();
  
    const formData = new FormData(event.target);
  
    resetErrorMessage();
    try {
      const response = await axios.post("/addNewAddress", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const result = await Swal.fire({
          icon: "success",
          title: "Successfully added new address",
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
        });
        if (result.value) {
          form.reset();
          location.reload();
        }
      } 
      else {
        Swal.fire({
          icon: "error",
          title: "Some error occured",
          showConfirmButton: true,
          confirmButtonText: "CANCEL",
          confirmButtonColor: "#D22B2B",
        });
      }
    } catch (error) {
        console.log(error);
      if (error.response.status === 400) {
        const validationErrors = error.response.data.error;
        Object.keys(validationErrors).forEach((key) => {
          document.getElementById(key).textContent = validationErrors[key];
        });
      } else {
        alert("something went wrong");
      }
    }
  });
  
  function resetErrorMessage() {
    const errorElements = document.querySelectorAll(".error-msg");
    errorElements.forEach((element) => {
      element.textContent = "";
    });
  }

