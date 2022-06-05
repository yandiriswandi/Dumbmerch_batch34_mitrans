import React from "react";
import { Link } from "react-router-dom";

import convertRupiah from "rupiah-format";

export default function SortingProductCard({ item, index }) {
  return (
    <Link
      to={`/product/` + item?.product.id}
      style={{ textDecoration: "none" }}
      key={index}
    >
      <div className="card-product mt-3 ">
        <img src={item?.product.image} className="img-fluid img-rounded" />
        <div className="p-2">
          <div className="text-header-product-item">{item?.product.name}</div>
          <div className="text-product-item">
            {convertRupiah.convert(item?.product.price)}
          </div>
          <div className="text-product-item">Stock : {item?.product.qty}</div>
        </div>
      </div>
    </Link>
  );
}
