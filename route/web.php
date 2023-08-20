<?php
namespace App\Core;

use App\Core\Router;
use App\Controllers\ApproController;
use App\controllers\CategorieController;
use App\Controllers\ArticleconfController;

Router::route("/article",[ArticleconfController::class,'index']);
Router::route("/store-article",[ArticleConfController::class,'store']);
Router::route("/categorie",[CategorieController::class,'index']);
// dd('yeahhhh');
Router::route("/approv",[ApproController::class,'index']);
Router::route("article",[ArticleConfController::class,'index']);
