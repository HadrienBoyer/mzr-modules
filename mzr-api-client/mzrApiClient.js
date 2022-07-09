"use strict";

class mzrApiClient {
	static url = "//localhost/mozarythm/api.mozarythm.com/api/";
	static headers = Object.freeze( {
		"Content-Type": "application/json; charset=utf-8",
	} );

	// store
	// ........................................................................
	static user = {};

	// ........................................................................
	static getMe() {
		return mzrApiClient.#fetch( "GET", "getMe.php" )
			.then( me => mzrApiClient.#assignMe( me ) );
	}
	static getUser( username ) {
		return mzrApiClient.#fetch( "GET", `getUser.php?username=${ username }` )
			.then( ( { data } ) => {
				data.usernameLow = data.username.toLowerCase();
				return data;
			} );
	}
	static getUserCompositions( iduser ) {
		return mzrApiClient.#fetch( "GET", `getUserCompositions.php?id=${ iduser }` )
			.then( ( { data } ) => {
				data.forEach( cmp => cmp.data = JSON.parse( cmp.data ) );
				return data;
			} );
	}
	static getComposition( id ) {
		return mzrApiClient.#fetch( "GET", `getComposition.php?id=${ id }` )
			.then( ( { data } ) => {
				data.composition.data = JSON.parse( data.composition.data );
				return data;
			} );
	}
	static login( email, pass ) {
		return mzrApiClient.#fetch( "POST", "login.php", { email, pass } )
			.then( me => mzrApiClient.#assignMe( me ) );
	}
	static signup( username, email, pass ) {
		return mzrApiClient.#fetch( "POST", "createUser.php", { username, email, pass } )
			.then( me => mzrApiClient.#assignMe( me ) );
	}
	static resendConfirmationEmail() {
		return mzrApiClient.#fetch( "POST", "resendConfirmationEmail.php", { email: mzrApiClient.user.email } );
	}
	static recoverPassword( email ) {
		return mzrApiClient.#fetch( "POST", "recoverPassword.php", { email } );
	}
	static resetPassword( email, code, pass ) {
		return mzrApiClient.#fetch( "POST", "resetPassword.php", { email, code, pass } );
	}
	static logout() {
		return mzrApiClient.#fetch( "POST", "logout.php", { confirm: true } )
			.then( res => mzrApiClient.#deleteMe( res ) );
	}
	static logoutRefresh() {
		return mzrApiClient.logout()
			.then( () => {
				setTimeout( () => location.href =
					location.origin + location.pathname, 500 );
			} );
	}
	static updateMyInfo( obj ) {
		return mzrApiClient.#fetch( "POST", "updateMyInfo.php", obj )
			.then( me => mzrApiClient.#assignMe( me ) );
	}
	static saveComposition( cmp ) {
		return mzrApiClient.#fetch( "POST", "saveComposition.php",
			{ composition: JSON.stringify( cmp ) } );
	}
	static deleteComposition( id ) {
		return mzrApiClient.#fetch( "POST", "deleteComposition.php", { id } );
	}

	// ..........................................................................
	static #assignMe( res ) {
		const u = res.data;

		u.usernameLow = u.username.toLowerCase();
		u.emailpublic = u.emailpublic === "1";
		u.emailchecked = u.emailchecked === "1";
		Object.assign( mzrApiClient.user, u );
		return u;
	}
	static #deleteMe( res ) {
		Object.keys( mzrApiClient.user ).forEach( k => delete mzrApiClient.user[ k ] );
		return res;
	}
	static #fetch( method, url, body ) {
		const obj = {
			method,
			headers: mzrApiClient.headers,
			credentials: "include",
		};

		if ( body ) {
			obj.body = JSON.stringify( body );
		}
		return fetch( mzrApiClient.url + url, obj )
			.then( res => res.text() ) // 1.
			.then( text => {
				try {
					return JSON.parse( text );
				} catch ( e ) {
					return {
						ok: false,
						code: 500,
						msg: text,
					};
				}
			} )
			.then( res => mzrApiClient.#fetchThen( res ) );
	}
	static #fetchThen( res ) {
		if ( !res.ok ) {
			res.msg = mzrApiClient.errorCode[ res.msg ] || res.msg;
			throw res; // 2.
		}
		return res;
	}

	// ........................................................................
	static errorCode = {
		"user:not-connected": "You are not connected",
		"query:bad-format": "The query is incomplete or corrupted",
		"login:fail": "The email/password don't match",
		"pass:too-short": "The password is too short",
		"email:too-long": "The email is too long",
		"email:not-found": "This email is not in the database",
		"email:duplicate": "This email is already used",
		"email:bad-format": "The email is not correct",
		"email:not-verified": "Your email is not verified",
		"username:too-long": "The username is too long",
		"username:too-short": "The username is too short",
		"username:duplicate": "This username is already taken",
		"username:bad-format": "The username can only contains letters, digits and _",
		"password:bad-code": "Can not change the password because the secret code and the email do not match",
		"password:already-recovering": "A recovering email has already been sent to this address less than 1 day ago",
	};
}

/*
1. Why res.text() instead of res.json() ?
   To handle the case where PHP returns a text error/exception with a default 200 code.

2. Every not-ok queries will throw the result instead of return it, why?
   To handle nicely the errors in the UI side, like:
   query().finally().then( OK, KO )
*/
