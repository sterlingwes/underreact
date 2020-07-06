const currencyFormatter = Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
});
const formatCurrency = (value) => currencyFormatter.format(value);

const Header = ({ children }) => (
  <h2 style={{ margin: 0, marginBottom: 5, padding: 0 }}>{children}</h2>
);

const SubHeader = ({ children }) => (
  <h3 style={{ margin: 0, marginBottom: 10, padding: 0 }}>{children}</h3>
);

const layoutStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const SplitLayout = ({ children }) => (
  <div className="split-layout" style={layoutStyle}>
    {children}
  </div>
);

const Price = ({ price, ppa, acreage }) => {
  let acreageStats;
  if (ppa) {
    const ppaRound = formatCurrency(Math.round(ppa * 100) / 100);
    const acres = Math.round(acreage * 10) / 10;
    acreageStats = `(${acres}ac, ${ppaRound} per acre)`;
  }

  return (
    <div>
      <span>{price}</span>
      {!!acreageStats && <span>{acreageStats}</span>}
    </div>
  );
};

const CloseCities = ({ distances }) => {
  const closeCities = Object.entries(distances);
  const cities = closeCities.sort((a, b) => a[1] - b[1]).slice(0, 3);

  return (
    <ul>
      {cities.map((city) => {
        const cityDistance = Math.round(city[1] * 100) / 100;
        return <li>{`${city[0]} (${cityDistance}kms)`}</li>;
      })}
    </ul>
  );
};

const Description = ({ children }) => (
  <div>{typeof children === 'string' ? children.replace('***', '') : children}</div>
);

const Images = ({ images }) => (
  <div>
    {!!images[0] && <img data-src={images[0].LowResPath} style="width: 256px; height: 200px;" />}
  </div>
);

const Card = ({ className, children }) => (
  <div
    className={`listing ${className}`}
    style={{
      position: 'relative',
      margin: 20,
      padding: 20,
      borderRadius: 5,
      backgroundColor: '#fff',
      boxShadow: '2px 2px 2px #eee',
    }}
  >
    {children}
  </div>
);

const ListingId = ({ children }) => (
  <div
    style={{
      position: 'absolute',
      top: 10,
      right: 10,
      fontSize: 12,
      color: '#ccc',
    }}
  >
    {children}
  </div>
);

const priceRanges = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const priceClassPrefix = 'listing-price';

const priceToRangeClass = (price) => {
  const priceValue = parseFloat(price.replace(/[^0-9.]/g, ''));
  let nearest10 = Math.floor(priceValue / 10000) * 10 + 10;
  if (nearest10 > 100) {
    nearest10 = 100;
  }
  return `${priceClassPrefix}-${nearest10}`;
};

const Listing = ({
  Property: {
    Address: { AddressText, Latitude: lat, Longitude: lon },
    Photo,
    Price: price,
  },
  Description: description,
  Distances: distances,
  Acreage: acreage,
  id,
  ...rest
}) => {
  const ppa = rest['Price per acre'];
  const detailUrl = rest['Detail URL'];
  const [address, location] = AddressText.split('|');
  const priceRangeClass = priceToRangeClass(price);

  return (
    <Card className={priceRangeClass}>
      <Header>{address}</Header>
      {!!location && <SubHeader>{location}</SubHeader>}
      <SplitLayout>
        {!!Photo && <Images images={Photo} />}
        <div style={{ marginLeft: 20 }}>
          <Price price={price} ppa={ppa} acreage={acreage} />
          <CloseCities distances={distances} />
          <Description>{description}</Description>
          <div style={{ paddingTop: 10 }}>
            <a href={detailUrl} style={{ marginRight: 10 }}>
              Listing Detail
            </a>
            <a href={`https://www.google.ca/maps/@${lat},${lon},10z`}>Google Maps</a>
          </div>
        </div>
      </SplitLayout>
      <ListingId>{id}</ListingId>
    </Card>
  );
};

const allRangesExcept = (rangeId) =>
  priceRanges
    .filter((range) => range !== rangeId)
    .map((range) => `.${priceClassPrefix}-${range}`)
    .join(', ');

let filteredList = [];

const visibleMargin = 20;

const nextVisible = () =>
  filteredList.find(
    (el) => el.offsetTop >= window.innerHeight + window.pageYOffset - visibleMargin * 2,
  );

const onFilterPrice = function (rangeId) {
  return function handler() {
    lazyLoad();
    const classes = allRangesExcept(rangeId);
    document.querySelectorAll(classes).forEach((listing) => {
      listing.classList.add('filtered');
    });
    document.querySelectorAll(`.${priceClassPrefix}-${rangeId}`).forEach((listing) => {
      listing.classList.remove('filtered');
    });

    filteredList = Array.from(document.querySelectorAll('.listing')).filter(
      (el) => el.classList.contains('filtered') === false,
    );

    document.querySelector('.scroll-next').style.display = 'inline-block';
  };
};

const allPriceRanges = priceRanges.map((range) => `.${priceClassPrefix}-${range}`).join(', ');

const showAll = () => {
  document.querySelectorAll(allPriceRanges).forEach((listing) => {
    listing.style.opacity = 1;
  });

  document.querySelector('.scroll-next').style.display = 'none';
};

const FilterButtons = () => (
  <div style={{ padding: 20, paddingBottom: 0 }}>
    {priceRanges.map((rangeId) =>
      rangeId >= 100 ? (
        <button onClick={showAll}>{'<=100k (All)'}</button>
      ) : (
        <button onClick={onFilterPrice(rangeId)}>{`<$${rangeId}k`}</button>
      ),
    )}
  </div>
);

const onScrollNext = () => {
  const next = nextVisible();
  if (next) {
    window.scrollTo({
      top: next.offsetTop - visibleMargin,
      behavior: 'smooth',
    });
  }
};

const ScrollButtons = () => (
  <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
    <div
      className="scroll-btn scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ⬆️ Top
    </div>
    <div className="scroll-btn scroll-next" style={{ display: 'none' }} onClick={onScrollNext}>
      ⏩ Next
    </div>
  </div>
);

const container = (
  <div>
    <FilterButtons />
    {listings.map((listing, index) => (
      <Listing key={index} {...listing} />
    ))}
    <ScrollButtons />
  </div>
);
