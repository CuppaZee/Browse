import { BrowseContentPlugin } from "../_plugin";

export class DarkStylePlugin extends BrowseContentPlugin {
  name = "Dark Style";
  id = "darkstyle";
  urls = [
    "*www.munzee.com/*",
    "*/munzee.com/*",
    "*statzee.munzee.com/*",
    "*www.munzee.com",
    "*/munzee.com",
    "*statzee.munzee.com",
  ];

  defaultOn = false;

  async injectStyles() {
    document.head.innerHTML += `
    <style>
      :root {
        --cz-redeem-card-bg: #232323;
        --cz-mapsandbox-off: #ff7777;
        --cz-mapsandbox-on: #77ff77;
        --cz-mapsandbox-captureareas: #77ff77;
        --cz-mapsandbox-scatterareas: #7777ff;
        --cz-mapsandbox-blockedareas: #ff7777;
      }
      body {
        background-color: #121212;
        color: white;
      }
      .panel-default {
        border-color: #232323;
      }
      .panel-footer {
        border-top-color: #121212;
        background-color: #232323;
      }
      .table > tbody > tr > td, .table > tbody > tr > th, .table > tfoot > tr > td, .table > tfoot > tr > th, .table > thead > tr > td, .table > thead > tr > th {
        border-top: 1px solid #232323;
      }
      .table-striped>tbody>tr:nth-child(odd)>td, .table-striped>tbody>tr:nth-child(odd)>th {
        background-color: #232323;
      }
      a {
        color: #00C35B;
      }
      a:hover {
        color: #cccccc;
      }
      #user-details-page .panel-default .stat {
        border: 2px solid #232323;
      }
      hr {
        border-top: 1px solid #232323;
      }
      .navbar {
        background-color: #232323;
      }
      .navbar-default {
        border-bottom-width: 0;
        height: 52px;
        box-shadow: 0 3px 2px rgba(255, 255, 255, .46)
      }
      .navbar-default .navbar-nav > li > a, .navbar-default .navbar-text {
        color: #aaa;
      }
      .navbar-default .navbar-nav > li > a:focus, .navbar-default .navbar-nav > li > a:hover {
        color: #ddd;
      }
      .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:focus, .navbar-default .navbar-nav > .active > a:hover {
        background-color: #00C35B;
        color: black;
      }
      .dropdown-menu, #generic-page .navbar-collapse .user-menu, #generic-page .navbar-collapse ul {
        background: #333333;
        color: white;
      }
      .dropdown-header {
        background-color: #00C35B;
        color: black;
      }
      .dropdown-menu > li > a {
        color: #ccc;
      }
      .dropdown-menu > li > a:focus, .dropdown-menu > li > a:hover {
        color: #00C35B;
      }
      .user-menu li a:hover {
        color: white;
        background: #016930;
      }
      .green, .user {
        background: #016930;
      }
      .green:hover, .user:hover, .user:focus, .navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:focus, .navbar-default .navbar-nav > .open > a:hover {
        background: #00C35B;
        color: black;
      }
      #clan-details, #munzee-details, #user-stats {
        position: relative;
        background: none;
      }
      #clan-details::before, #munzee-details::before, #user-stats::before {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: 0.2;
        content: "";
        z-index: -1;
        background: #00C35B url("https://server.cuppazee.app/LoginBackground.png")
      }
      .stat-green {
        background: #00C35B;
        color: black;
      }
      .user-stat a, .user-stat a:hover, .user-stat span, .user-stat span:hover {
        color: black;
      }
      #sub-menu {
        background: #016930;
        border-color: #016930;
      }
      .clan a, .clan h2 small, #munzee-details .deployed a {
        color: #ccc;
      }
      .card {
        background: #232323;
      }
      #types-page .alterna, #types-page .teammate .description span {
        color: #ccc;
      }
      #types-page .teammate .card.rotate:hover, #team-page .teammate .card:hover {
        background-color: #016930;
      }
      #sidebar .nav li a {
        color: #ccc;
      }
      #sidebar .nav li a:hover {
        color: #00C35B;
      }
      #sidebar .nav li:hover {
        border-left-color: #00C35B;
      }
      .active, .collapsible:hover {
        background-color: #00C35B;
      }
      #sidebar .nav li.active:hover {
        background-color: #016930;
      }
      #sidebar .nav li.active a {
        color: black;
      }
      #sidebar .nav li.active a:hover {
        color: white;
      }
      .btn-success:not(.dark) {
        border-color: #016930;
      }
      .btn-success:hover.dark {
        border-color: transparent;
      }
      .showcase-lighter-green {
        background-color: #232323;
      }
      .how i {
        color: #00C35B;
      }
      .captures {
        background-color: #016930;
      }
      .deployments {
        background-color: #00C35B;
      }
      #footer ul.nav li a.social-link {
        color: #00C35B;
      }
      #testimonials-page .testimonial-box {
        background-color: #232323;
        color: white;
      }
      blockquote {
        color: white;
      }
      .world-rank span.badge {
        background-color: white;
        color: black;
      }
      .badge-success, .title-badge {
        background-color: #00C35B;
        color: black;
      }
      #clan-details, #munzee-details, #user-stats {
        margin-top: 54px;
      }
      #munzee-holder section .stat, #room-holder section .stat {
        background-color: #00C35B;
        color: black;
      }
      .form-control {
        background-color: #333333;
        color: white;
      }
      .pager li > a, .pager li > span, .pager .disabled > a, .pager .disabled > a:focus, .pager .disabled > a:hover, .pager .disabled > span {
        background-color: #00C35B;
        color: black;
      }
      .pager li > a:focus, .pager li > a:hover {
        background-color: #016930;
        color: white;
      }
      .pager .disabled > a, .pager .disabled > a:focus, .pager .disabled > a:hover, .pager .disabled > span {
        opacity: 0.6;
      }
      #munzee-holder section .wrote-at, #room-holder section .wrote-at {
        background-color: #016930;
      }
      .popover {
        background-color: #333333;
      }
      .popover-title {
        background-color: #232323;
      }
      .panel-heading {
        background-color: #016930;
      }
      #user-gallery-page .munzee-photo-small.active-photo {
        border-color: #00C35B;
      }
      #munzee-holder .table tbody td:nth-of-type(4), #munzee-holder .table tbody td:nth-of-type(6), #blasts-page #munzee-holder .table tbody td:nth-of-type(1) {
        background-color: #333333;
      }
      #munzee-holder .table tbody td, #blasts-page #munzee-holder .table tbody td, #munzee-holder .table tbody td:nth-of-type(5), #munzee-holder .table tbody td:nth-of-type(7) {
        background-color: #232323;
      }

      .alert-info {
        background-color: #31708f;
        color: #d9edf7;
        border-color: transparent;
      }
      .alert-danger {
        background-color: #a94442;
        color: #f2dede;
        border-color: transparent;
      }
      .alert-warning {
        background-color: #8a6d3b;
        color: #fcf8e3;
        border-color: transparent;
      }
      .alert-success {
        background-color: #3c763d;
        color: #dff0d8;
        border-color: transparent;
      }
      #flow-page .subtext {
        color: #ccc;
      }

      #loyaltylion .lion-history-table {
        background-color: #232323;
        color: white;
        border: 0px;
      }
      #loyaltylion .lion-history-table__header-cell {
        background-color: #333333;
        color: white;
      }
      #loyaltylion .lion-history-table__row {
        background-color: #232323;
      }
      #loyaltylion .lion-history-table__row:nth-child(2n) {
        background-color: #121212;
      }
      #loyaltylion .lion-history-state-bubble--approved {
        background-color: #03543f;
        color: #def7ec;
      }

      .pinpoints-container table td, .pinpoints-container table th {
        border: 1px solid #333333;
      }
      
      #leaderboard-split-page .rank, #leaderboard-split-page .leaderboard-captures, #leaderboard-split-page .points {
        background-color: #333333;
        color: white;
      }

      #stats-generic-page .global-stat h3 {
        color: #ccc;
      }
      #stats-generic-page .global-stat h3 span {
        color: #00C35B;
      }

      #credits-page table {
        background-color: #333;
      }

      .mapboxgl-popup-content {
        background-color: #232323;
      }

      #openquickdeploymodal {
        background-color: #004400 !important;
      }
      #removeFromSB {
        background-color: #440000 !important;
      }
      #removeFromSB:hover, #openquickdeploymodal:hover {
        color: #fff !important;
      }
    </style>
  `;
  }

  async execute() {
    this.injectStyles();
  }
}
