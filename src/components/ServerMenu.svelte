<script>
  import { serverJWT } from "../libs/store";
  export let page;
  export let logout = () => {}
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">

    <a class="navbar-brand" href="#" on:click|preventDefault={() => { page = null }} >
        <img src="https://logos-download.com/wp-content/uploads/2018/04/Iota_logo_black-700x678.png" width="30" height="30" class="d-inline-block align-top" alt="">
        IOTA e-Commerce IDE
    </a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Identity
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" on:click|preventDefault={() => { page = "create-person" }} href="!#">Create Person</a>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link" on:click|preventDefault={() => { page = "create-credential" }} href="#">Credential</a>
        </li>
        <!--
        <li class="nav-item active">
          <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>        
        -->
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" on:click|preventDefault={logout}>Logout</a>
        </li>
      </ul>
      <!--
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    -->
    </div>
  </nav>