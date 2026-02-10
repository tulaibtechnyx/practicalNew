import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"

//executive form data
function executiveFormRequest(payload, thunkAPI) {
    try {
      const { executiveFormData } = payload
      const response = ApiResource.post(ApiConstants.executiveForm, executiveFormData)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }


  function allergiesRequest(payload, thunkAPI) {
    try {
      const response = ApiResource.get(ApiConstants.allergies)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
  //executive form data


  export const ExecutiveApiServices = {
    executiveFormRequest,
    allergiesRequest
  }
  