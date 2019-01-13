import React, { Component } from "react";
import { Prompt } from "react-router";
import "./ListDeal.css";
import Layout from "../Layout";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import {
  _uploadImage,
  onSelectImageToView,
  _removeImage,
  handleUploadingPhotosStep,
  handlePricingStep,
  handleDescriptionStep,
  onDiscountPercentageToChange,
  OnUSDPriceChange,
  validateDecimalForBasePrice,
  _getCryptoExchange,
  removeSelectedCrypto,
  handleSelectedCategory,
  handleSelectedCondition,
  onEditingDealName,
  onEditingDetail,
  _submitDeal,
  closeModalAfterDealCreated,
  resetListDeal
} from "../../actions/listDealActions";
import { _loadCryptocurrencies } from "../../actions/loadCryptoActions";
import { _loadCategory } from "../../actions/categoryActions";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import UploadingImage from "./UploadImage";
import Pricing from "./Pricing";
import Description from "./Description";

class ListDeal extends Component {
  componentDidMount = () => {
    this.props._loadCryptocurrencies();
    this.props._loadCategory();
  };
  // If user refreshes the page, we warn users that data won't be saved
  componentDidUpdate = () => {
    const { images } = this.props;
    if (images.length > 0) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  };

  handleImageUpload = e => {
    const file = e.target.files;
    const formData = new FormData();

    formData.append("file", file[0]);

    this.props._uploadImage(localStorage.getItem("token"), formData);
  };

  imageOnView = () => {
    const { uploading, images, imageView } = this.props;
    switch (true) {
      case uploading:
        return <LoadingSpinner />;
      case images.length > 0:
        // localStorage.setItem("image", imageData.Location);
        return (
          <img
            id="shown-uploading-image"
            src={imageView}
            alt="uploaded_image"
          />
        );
      default:
        return (
          <div id="uploading-image">
            <label htmlFor="photos-upload">
              <div>
                <i class="fas fa-camera fa-7x" />
              </div>
              <div>
                <strong>Add a Photo</strong>
                <p>Images must be in PNG or JPG format and under 5mb</p>
              </div>
            </label>
            <input
              type="file"
              id="photos-upload"
              onChange={this.handleImageUpload}
            />
          </div>
        );
    }
  };

  onSelectImageToReMove = e => {
    let imageKey = e.target.parentElement.getAttribute("data-imagekey");
    this.props._removeImage(localStorage.getItem("token"), imageKey);
  };

  calculateCryptoExchange = event => {
    debugger
    const {
      _getCryptoExchange,
      crypto_amount,
      removeSelectedCrypto
    } = this.props;
    let cryptoSymbol = event.target.getAttribute("data-cryptosymbol");

    if (crypto_amount[cryptoSymbol]) {
      //if selected/true
      removeSelectedCrypto(cryptoSymbol);
    } else {
      _getCryptoExchange(
        localStorage.getItem("token"),
        cryptoSymbol,
        this.props.priceInCrypto
      );
    }
  };

  onCreateDeal = () => {
    const { dealName, selectedCategory, selectedCondition, _submitDeal, images, priceInUSD, priceInCrypto, crypto_amount } = this.props;

    let textDetailRaw = convertToRaw(this.props.editorState.getCurrentContent());
    let selected_cryptos = Object.keys(crypto_amount);

    _submitDeal(localStorage.getItem("token"), dealName, selectedCategory, selectedCondition, textDetailRaw, images, priceInUSD, priceInCrypto, selected_cryptos);

  };

  handleImageUploadValidation = () => {
    const validateImageUploaded = {
      imageSRC: this.props.images[0]
    }
    let isDataValid = false;

    //Object.keys(validateNewInput) give us an array of keys
    //Array.every check if all indices passed the test
    //we check if the value of each property in the the object validateNewInput is === true
    if (Object.keys(validateImageUploaded).every((k) => {
      return validateImageUploaded[k] ? true : false
    })) {
      isDataValid = true;
    } else {
      this.notifyImageUploadError();
    }

    return isDataValid;
  }

  handlePricingValidation = () => {
    const validatePricing = {
      basePrice: this.props.priceInUSD,
      selectedCrypto: Object.keys(this.props.crypto_amount).length !== 0 //check if user has selected a crypto
    }
    let isDataValid = false;

    //Object.keys(validateNewInput) give us an array of keys
    //Array.every check if all indices passed the test
    //we check if the value of each property in the the object validateNewInput is === true
    if (Object.keys(validatePricing).every((k) => {
      return validatePricing[k] ? true : false
    })) {
      isDataValid = true;
    } else {
      // this.props.priceInUSD ? this.notifyCryptoNotSelectedError() : this.notifyBasePriceEmptyError();
      if (!this.props.priceInUSD || this.props.priceInUSD === "NaN") {
        this.notifyBasePriceEmptyError();
      } else if (Object.keys(this.props.crypto_amount).length === 0) {
        this.notifyCryptoNotSelectedError();
      }
    }
    return isDataValid;
  }

  validateBasePriceToBeEnteredBeforeSelectCrypto = () => {
   const basePrice = this.props.priceInUSD;

   let isDataValid = false;

  if (basePrice && basePrice !== "NaN" && basePrice !== "0.00") {
    isDataValid = true;
  } else {
    this.notifyBasePriceEmptyError();
  }
  
  return isDataValid;

  }

  notifyImageUploadError = () => {
    toast.error("Please upload an image first.", {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  notifyBasePriceEmptyError = () => {
    toast.error("Enter your base price.", {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  notifyCryptoNotSelectedError = () => {
    toast.error("Select at least one Cryptocurrency.", {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  render() {
    const {
      error,
      images,
      showPhotosStep,
      showPricingStep,
      showDescriptionStep,
      discountPercent,
      priceInUSD,
      cryptoOptionsForCreatingDeal,
      gettingRate,
      crypto_amount,
      parentCategory,
      editorState,
      creatingDeal,
      creatingDealError,
      dealCreated,
      modalVisible,

      onSelectImageToView,
      handleUploadingPhotosStep,
      handlePricingStep,
      handleDescriptionStep,
      onDiscountPercentageToChange,
      OnUSDPriceChange,
      priceInCrypto,
      validateDecimalForBasePrice,
      dealName,
      selectedCategory,
      selectedCondition,
      handleSelectedCategory,
      handleSelectedCondition,
      onEditingDealName,
      onEditingDetail,
      closeModalAfterDealCreated
    } = this.props;

    if (error) {
      return <div>Error! {error.message}</div>;
    }

    return (
      <div>
        {/* If user is navigating away from the page, let user know data won't be saved */}
        {/* <Prompt
          when={images.length > 0}
          message="Changes you made may not be saved."
        /> */}
        <Layout>
          <div className="deal-container">
            <div className="ui three steps">
              <a
                onClick={handleUploadingPhotosStep}
                className={showPhotosStep ? "active step" : "step"}
              >
                <i className="image icon" />
                <div className="content">
                  <div className="title">Photos</div>
                  <div className="description">Add up to six photos</div>
                </div>
              </a>
              <a
                onClick={() => this.handleImageUploadValidation() && handlePricingStep()}
                className={showPricingStep ? "active step" : "step"}
              >
                <i className="bitcoin icon" />
                <div className="content">
                  <div className="title">Pricing</div>
                  <div className="description">
                    Give your deal a discount price in crypto
                  </div>
                </div>
              </a>

              <a
                onClick={() => this.handlePricingValidation() && handleDescriptionStep()}
                className={"step " + (!showPricingStep && showPhotosStep ? "disabled" : showDescriptionStep ? "active" : "" )}
              >
                <i className="edit icon" />
                <div className="content">
                  <div className="title">Description</div>
                  <div className="description">
                    Let the world know more about your listing
                  </div>
                </div>
              </a>
            </div>
          </div>
          {showPhotosStep && (
            <UploadingImage
              viewImage={onSelectImageToView}
              uploadedImages={images}
              uploadImage={this.handleImageUpload}
              imageIsOnPreview={this.imageOnView}
              removeImage={this.onSelectImageToReMove}
              validateImageUpload={this.handleImageUploadValidation}
              showPricingStep={handlePricingStep}
            />
          )}
          {showPricingStep && (
            <Pricing
              changeDiscountPercent={onDiscountPercentageToChange}
              showDiscountPercent={discountPercent}
              showPriceUSD={priceInUSD}
              showPriceCrypto={priceInCrypto}
              handlePriceUSDChange={OnUSDPriceChange}
              validateBasePrice={validateDecimalForBasePrice}
              cryptoOptions={cryptoOptionsForCreatingDeal}
              getCryptoExchange={this.calculateCryptoExchange}
              rateLoading={gettingRate}
              showCryptoAmount={crypto_amount}
              validatePricingStep={this.handlePricingValidation}
              showDescriptionStep={handleDescriptionStep}
              validateSelectedCrypto={this.validateBasePriceToBeEnteredBeforeSelectCrypto}
            />
          )}
          {showDescriptionStep && (
            <Description
              editDealName={onEditingDealName}
              dealNameValue={dealName}
              selectedCategoryValue={selectedCategory}
              selectedConditionValue={selectedCondition}
              categories={parentCategory}
              selectedCategory={handleSelectedCategory}
              selectedCondition={handleSelectedCondition}
              updateEditDetail={onEditingDetail}
              showEdittingState={editorState}
              createDeal={this.onCreateDeal}
              loading_dealCreating={creatingDeal}
              error_dealCreating={creatingDealError}
              deal_id={dealCreated.deal_id}
              closeModal={closeModalAfterDealCreated}
              modalOpened={modalVisible}
              resetDealCreated={resetListDeal}
            />
          )}
        </Layout>
        <ToastContainer autoClose={8000} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  imageData: state.CreateDeal.imageData,
  images: state.CreateDeal.images,
  imageView: state.CreateDeal.imageView,
  uploading: state.CreateDeal.uploading,
  error: state.CreateDeal.error,
  showPhotosStep: state.CreateDeal.showPhotosStep,
  showPricingStep: state.CreateDeal.showPricingStep,
  showDescriptionStep: state.CreateDeal.showDescriptionStep,
  discountPercent: state.CreateDeal.discountPercent,
  priceInUSD: state.CreateDeal.priceInUSD,
  priceInCrypto: state.CreateDeal.priceInCrypto,
  cryptoOptionsForCreatingDeal: state.LoadCrypto.cryptoOptionsForCreatingDeal,
  gettingRate: state.CreateDeal.gettingRate,
  crypto_amount: state.CreateDeal.crypto_amount,
  dealName: state.CreateDeal.dealName,
  parentCategory: state.CreateDeal.parentCategory,
  selectedCategory: state.CreateDeal.selectedCategory,
  selectedCondition: state.CreateDeal.selectedCondition,
  editorState: state.CreateDeal.editorState,
  creatingDeal: state.CreateDeal.creatingDeal,
  creatingDealError: state.CreateDeal.creatingDealError,
  dealCreated: state.CreateDeal.dealCreated,
  modalVisible: state.CreateDeal.modalVisible
});

const matchDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      _uploadImage,
      onSelectImageToView,
      _removeImage,
      handleUploadingPhotosStep,
      handlePricingStep,
      handleDescriptionStep,
      onDiscountPercentageToChange,
      OnUSDPriceChange,
      validateDecimalForBasePrice,
      _loadCryptocurrencies,
      _getCryptoExchange,
      removeSelectedCrypto,
      _loadCategory,
      handleSelectedCategory,
      handleSelectedCondition,
      onEditingDealName,
      onEditingDetail,
      _submitDeal,
      closeModalAfterDealCreated,
      resetListDeal
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(ListDeal);
