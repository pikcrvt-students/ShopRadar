<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop Radar</title>
    <link rel="stylesheet" href="styles.css" >
</head>
<body>
    <header class="header">
        <a href="./home.html" class="header-logo">
            <img 
                class="headerlogoimg"
                src="../images/logo.png" 
                alt="Shop Radar Logo"
                height="40" loading="lazy"
            />
        </a>
        <nav class="header-menu">
            <ul class="header-menu-list">
                <li class="header-menu-item">
                  <a href="home.html" class="header-menu-link is-current">Home</a>  
                </li>
                <li class="header-menu-item">
                  <a href="./lidl.html" class="header-menu-link">LIDL</a>  
                </li>
                <li class="header-menu-item">
                  <a href="./maxima.html" class="header-menu-link">MAXIMA</a>  
                </li>
                <li class="header-menu-item">
                  <a href="./rimi.html" class="header-menu-link">RIMI</a>  
                </li>
        </nav>
        <div class="header-actions">
            <button 
                class="header-book-button button"
                type="button"
            >
                Shoping Cart
            </button>
            <button class="header-acount-button" 
            type="button"
            >
            </button>
        </div>
    </header>
    <main class="content">
        <section class="banner">
            <div class="banner-body">
                <div class="banner-info">
                    <p class="banner-subtitle">Smart shopping every day</p>

                    <h1 class="banner-title">
                        Best deals from<br>
                        different stores
                    </h1>

                    <p class="banner-description">
                        Compare prices, discounts and offers from LIDL, MAXIMA and RIMI
                        in one place. Find the best product faster and save your money.
                    </p>

                    <div class="banner-actions">
                        <a href="#offers" class="button button--primary" type="button">View deals</a>
                        <a href="./lidl.html" class="button button--secondary" type="button">Browse stores</a>
                </div>
            </div>

        <div class="banner-card">
            <p class="banner-card-label">Top offer</p>

            <div class="banner-card-image">
                <img src="../images/product-example.png" alt="Product image">
            </div>

            <div class="banner-card-content">
                <p class="banner-card-store">LIDL</p>
                <?php 
                require __DIR__.'/vendor/autoload.php';
                
                $url = 'https://www.rimi.lv/e-veikals/lv/akcijas-piedavajumi';
                
                $client = new \GuzzleHttp\Client();
                $resp = $client->get($url);
                $html = $resp->getBody()->getContents();
                
                $document = new \DiDom\Document();
                $document->loadHtml($html);
                
                $productId = 'product-name-815307';
                
                $posts = $document->find("#$productId");
                
                if (!empty($posts)) {
                    echo $posts[0]->text();
                    } else {
                        echo "Produkts nav atrasts";
                        }
                ?>

                <div class="banner-card-prices">
                    <span class="banner-card-old-price">€2.49</span>
                    <span class="banner-card-new-price">€1.69</span>
                </div>

                <p class="banner-card-discount">Save 32%</p>

                <a href="./lidl.html" class="button button--offer" type="button" >View offer</a>
            </div>
        </div>
    </div>
        </section>
        <section class="search">
            <div class="search-body">
                <div class="search-field">
                    <input type="text" placeholder="Search..">
                </div>
                <ul class="search-filter">
                    <li class="serach-filter-items">LIDL</li>
                    <li class="serach-filter-items">MAXIMA</li>
                    <li class="serach-filter-items">RIMI</li>
                    <li class="serach-filter-items">CHEAPEST</li>
                </ul>
            </div>
        </section>
        <section class="product">
            <div class="product-body">
                <div class="product-tabel">
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">RIMI</p>
                        <h2 class="product-offer-card-title"><?php 
                        require __DIR__.'/vendor/autoload.php';
                
                        $url = 'https://www.rimi.lv/e-veikals/lv/akcijas-piedavajumi';
                        
                        $client = new \GuzzleHttp\Client();
                        $resp = $client->get($url);
                        $html = $resp->getBody()->getContents();
                        
                        $document = new \DiDom\Document();
                        $document->loadHtml($html);
                        
                        $productId = 'product-name-269153';
                        
                        $posts = $document->find("#$productId");
                        
                        if (!empty($posts)) {
                            echo $posts[0]->text();
                            } else {
                                echo "Produkts nav atrasts";
                                }
                        ?></h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title"><?php 
                        require __DIR__.'/vendor/autoload.php';
                
                        $url = 'https://www.rimi.lv/e-veikals/lv/akcijas-piedavajumi';
                        
                        $client = new \GuzzleHttp\Client();
                        $resp = $client->get($url);
                        $html = $resp->getBody()->getContents();
                        
                        $document = new \DiDom\Document();
                        $document->loadHtml($html);
                        
                        $productId = 'product-name-299852';
                        
                        $posts = $document->find("#$productId");
                        
                        if (!empty($posts)) {
                            echo $posts[0]->text();
                            } else {
                                echo "Produkts nav atrasts";
                                }
                        ?></h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title">Fresh apples 1kg</h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title">Fresh apples 1kg</h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title">Fresh apples 1kg</h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title">Fresh apples 1kg</h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title">Fresh apples 1kg</h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title">Fresh apples 1kg</h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                    <div class="product-tabel-offer">
                        <p class="product-offer-card-store">LIDL</p>
                        <h2 class="product-offer-card-title">Fresh apples 1kg</h2>
                        <div class="product-offer-card-prices">
                            <span class="product-offer-card-old-price">€2.49</span>
                            <span class="product-offer-card-new-price">€1.69</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="top-offers">
    <div class="top-offers-body">
        <h2 class="top-offers-title">Top offers today</h2>

        <div class="top-offers-cards">
            <article class="top-offers-card">
                <p class="top-offers-card-label">Biggest discount</p>
                <h3 class="top-offers-card-title">Fresh apples 1kg</h3>
                <p class="top-offers-card-store">LIDL</p>
                <div class="top-offers-card-prices">
                    <span class="top-offers-card-old-price">€2.49</span>
                    <span class="top-offers-card-new-price">€1.69</span>
                </div>
                <p class="top-offers-card-discount">Save 32%</p>
            </article>

            <article class="top-offers-card">
                <p class="top-offers-card-label">Cheapest product</p>
                <h3 class="top-offers-card-title">Natural yogurt</h3>
                <p class="top-offers-card-store">MAXIMA</p>
                <div class="top-offers-card-prices">
                    <span class="top-offers-card-old-price">€1.50</span>
                    <span class="top-offers-card-new-price">€0.99</span>
                </div>
                <p class="top-offers-card-discount">Best price today</p>
            </article>
        </div>
    </div>
        </section>
    </main>
    <footer class="footer">
    <div class="footer-body">
        <a href="#" class="footer-link">Contacts</a>
        <a href="#" class="footer-link">Stores</a>
        <a href="#" class="footer-link">Socials</a>
    </div>
</footer>
</body>
</html>