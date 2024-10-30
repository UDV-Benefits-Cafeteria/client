import type { FC } from "react";

import { useGetAllBenefitQuery } from "@entity/Benefit/api/Benefit.api";
import { DataTable } from "@feature/DataTable";
import { SearchBar } from "@feature/SearchBar";
import emptyImage from "@shared/assets/images/Avatar.png";
import { Button } from "@shared/ui/Button";
import { Image } from "@shared/ui/Image/Image";
import { ViewHeader } from "@shared/ui/ViewInfoContainer/ViewHeader";
import { ViewInfoContainer } from "@shared/ui/ViewInfoContainer/ViewInfoContainer";
import { useNavigate } from "react-router-dom";

import { BENEFITS, CREATE_BENEFITS, EMPLOYEES } from "@app/providers/AppRouter/AppRouter.config";

import styles from "../styles/ViewBenefits.module.scss";

const tableHeader = [
  {
    text: "Название бенефита",
    data: "name",
  },
  {
    text: "В наличии, шт.",
    data: "amount",
  },
  {
    text: "Требуемый уровень",
    data: "level",
  },
  {
    text: "Цена, UDV-coins",
    data: "coins",
  },
  {
    text: "Цена, руб.",
    data: "price",
  },
];

export const ViewBenefits: FC = () => {
  const benefits = useGetAllBenefitQuery(null);
  const navigate = useNavigate();

  const data = benefits?.data
    ? benefits.data.map(el => ({
        id: el.id,
        name: (
          <span className={styles.fullname}>
            <Image
              type={"avatar"}
              srs={el.primary_image_url || emptyImage}
            />
            {el.name}
          </span>
        ),
        amount: el.amount,
        level: el.min_level_cost,
        coins: el.coins_cost || "бесплатно",
        price: el.real_currency_cost || "бесплатно",
      }))
    : [];

  return (
    <ViewInfoContainer>
      <ViewHeader
        title={"Бенефиты"}
        searchBar={<SearchBar />}
      >
        <div style={{ display: "flex", width: 300, gap: 32 }}>
          <Button onClick={() => navigate(CREATE_BENEFITS)}>Добавить бенефит</Button>
        </div>
      </ViewHeader>

      <DataTable
        redirectTo={id => `${BENEFITS}/${id}/edit`}
        headers={tableHeader}
        data={data}
      />
    </ViewInfoContainer>
  );
};
