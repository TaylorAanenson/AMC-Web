export function _loadDealItem(deal_name) {
  const settings = {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  };

  return dispatch => {
    dispatch(fetchDealItemBegin());
    return fetch(`/api/deals/${deal_name}`, settings)
      .then(res => res.json())
      .then(jsonPhoto => {
        dispatch(fetchDealItemSuccess(jsonPhoto));
        return jsonPhoto;
      })
      .catch(error => dispatch(fetchDealItemFailure(error)));
  };
}

export const fetchDealItemBegin = () => ({
  type: "FETCH_DEAL_ITEM_BEGIN"
});


export const fetchDealItemSuccess = dealItem => ({
  type: "FETCH_DEAL_ITEM_SUCCESS",
  payload: { dealItem }
});

export const fetchDealItemFailure = error => ({
  type: "FETCH_DEAL_ITEM_FAILURE",
  payload: { error }
});


export const resetDealitemState = () => {
  return {
      type: 'LOCATION_CHANGE'
  }
};

export const handleCustomizingSize = (event) => {
  return {
      type: 'SELECT_SIZE',
      payload: event.target.value
  }
};

export const handleCustomizingColor = (event) => {
  return {
      type: 'SELECT_COLOR',
      payload: event.target.value
  }
};

export const handleFullNameInput = (event) => {
  return {
      type: 'FULL_NAME',
      payload: event.target.value
  }
};

export const handleAddressInput = (event) => {
  return {
      type: 'SHIPPING_ADDRESS',
      payload: event.target.value
  }
};

export const handleCityInput = (event) => {
  return {
      type: 'SHIPPING_CITY',
      payload: event.target.value
  }
};

export const handleZipcodeInput = (event) => {
  return {
      type: 'ZIP_CODE',
      payload: event.target.value
  }
};

export const handleShippingStateInput = (event) => {
  return {
      type: 'SHIPPING_STATE',
      payload: event.target.value
  }
};

export const handleSelectedCrypto = (selectedOption) => {
  return {
      type: 'SELECT_PAYMENT',
      payload: {selectedOption}
  }
};

