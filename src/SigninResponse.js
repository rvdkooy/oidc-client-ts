import Log from './Log';
import UrlUtility from './UrlUtility';

export default class SigninResponse {
    constructor(url) {
        
        var values = UrlUtility.parseUrlFragment(url);
        
        this._state = values.state;
        
        if (values.error){
            this._error = values.error;
            this._error_description = values.error_description;
            this._error_uri = values.error_uri;
        }
        else {
            this._id_token = values.id_token;
            this._session_state = values.session_state;
            this._access_token = values.access_token;
            this._token_type = values.token_type;
            this._scope = values.scope;
            
            let expires_in = parseInt(values.expires_in);
            if (typeof expires_in === 'number' && expires_in > 0){
                let now = parseInt(Date.now() / 1000);
                this._expires_at = now + expires_in;
            }
        }
    }
    
    get state(){
        return this._state;
    }
    set state(value){
        this._state = value;
    }
    
    get error(){
        return this._error;
    }
    get error_description(){
        return this._error_description;
    }
    get error_uri(){
        return this._error_uri;
    }

    get id_token(){
        return this._id_token;
    }
    get session_state(){
        return this._session_state;
    }
    get access_token(){
        return this._access_token;
    }
    get token_type(){
        return this._token_type;
    }
    get scope(){
        return this._scope;
    }
    get expires_in(){
        if (this.expires_at){
            let now = parseInt(Date.now() / 1000);
            return this.expires_at - now;
        }
        return undefined;
    }
    get expires_at(){
        return this._expires_at;
    }
    
    get profile(){
        return this._profile;
    }
    set profile(value){
        this._profile = value;
    }
}