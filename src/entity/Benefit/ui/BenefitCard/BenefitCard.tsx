import { FC } from "react";

import { BENEFIT_PLACEHOLDER } from "@shared/assets/imageConsts";
import { useAppSelector } from "@shared/lib/hooks/useAppSelector/useAppSelector";
import { Button } from "@shared/ui/Button";
import { Image } from "@shared/ui/Image/Image";
import { Text } from "@shared/ui/Text";
import { useNavigate } from "react-router-dom";

import { BENEFITS } from "@app/providers/AppRouter/AppRouter.config";

import { TBenefitData } from "@entity/Benefit/model/types/Benefit.types";

import styles from "../../styles/BenefitCard.module.scss";

export const BenefitCard: FC<{ benefit: TBenefitData; addRequest: (id: number) => void }> = ({
  benefit,
  addRequest,
}) => {
  const user = useAppSelector(state => state.user.data!);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div
        className={styles.container}
        onClick={() => navigate(BENEFITS + "/" + benefit.id)}
      >
        <Image
          className={styles.image}
          src={benefit.primary_image_url || BENEFIT_PLACEHOLDER}
          onError={(e) => (e.target.src = BENEFIT_PLACEHOLDER)}
        />

        <div className={styles.price}>
          <Text>{benefit.coins_cost}</Text>

          <div className={styles.coin} />
        </div>

        <Text>C {benefit.min_level_cost} уровня</Text>

        <Text className={styles.amount}>
          {benefit.amount > 0 ? <>Осталось {benefit.amount} шт.</> : "Бенефит закончился!"}
        </Text>

        <Text> {benefit.name}</Text>
      </div>

      <Button
        onClick={() => addRequest(benefit.id)}
        disabled={benefit.amount === 0 || benefit.min_level_cost > user.level || benefit.coins_cost > user.coins}
      >
        Отправить запрос
      </Button>
    </div>
  );
};
