// utils/errorTracker.js
export class ErrorTracker {
  static pushErrorToDataLayer(errorData: any) {
    if (typeof window !== 'undefined' && window.dataLayer) {
      const errorEvent = {
        event: 'error',
        error_category: errorData.category || 'frontend',
        error_message: errorData.message,
        error_code: errorData.code || null,
        screen_type: errorData.screenType || 'unknown',
        screen_name: errorData.screenName || 'Unknown Screen',
        screen_url: errorData.screenUrl || window.location.href,
      };
      
      window.dataLayer.push(errorEvent);
      console.log('Error event pushed to dataLayer:', errorEvent);
    }
  }

  static trackJavaScriptError(error: any, category = 'frontend') {
    const errorData = {
      category,
      message: error.message,
      code: null,
      screenType: this.getScreenType(),
      screenName: this.getScreenName(),
      screenUrl: window.location.href,
      stack: error.stack,
    };
    
    this.pushErrorToDataLayer(errorData);
  }

  static trackNetworkError(error: any, url: any, status: any, category = 'network') {
    const errorData = {
      category,
      message: error.message || `Network error: ${status} for ${url}`,
      code: status,
      screenType: this.getScreenType(),
      screenName: this.getScreenName(),
      screenUrl: window.location.href,
      additionalData: {
        request_url: url,
        status_code: status,
        error_type: 'NetworkError'
      }
    };
    
    this.pushErrorToDataLayer(errorData);
  }

  static trackCustomError(message: any, category = 'frontend', code = 400, deviceType = 'desktop', screenName = '/') {
    const errorData = {
      category,
      message,
      code,
      screenType: deviceType,
      screenName: screenName,
      screenUrl: window.location.href,
    };
    
    this.pushErrorToDataLayer(errorData);
  }

  static getScreenType() {
    const pathname = window.location.pathname;
    if (pathname === '/') return 'home';
    if (pathname.includes('/product/')) return 'pdp';
    if (pathname.includes('/cart')) return 'cart';
    if (pathname.includes('/checkout')) return 'checkout';
    if (pathname.includes('/account')) return 'account';
    return 'other';
  }

  static getScreenName() {
    const pathname = window.location.pathname;
    if (pathname === '/') return 'Home Page';
    if (pathname.includes('/product/')) {
      const productName = document.title.replace(' - Tamkeen Stores', '');
      return productName || 'Product Detail Page';
    }
    if (pathname.includes('/cart')) return 'My Cart';
    if (pathname.includes('/checkout')) return 'Checkout';
    if (pathname.includes('/account')) return 'My Account';
    return document.title || 'Unknown Page';
  }

  static extractLineNumber(error: any) {
    if (error.stack) {
      const match = error.stack.match(/:\d+:\d+/);
      return match ? match[0].split(':')[1] : null;
    }
    return null;
  }

  static extractColumnNumber(error: any) {
    if (error.stack) {
      const match = error.stack.match(/:\d+:\d+/);
      return match ? match[0].split(':')[2] : null;
    }
    return null;
  }
}