import { rtkApi } from "@shared/api/rtkApi";

import type { TBenefit, TBenefitData } from "@entity/Benefit/model/types/Benefit.types";

const transform = (image: File) => {
  const formData = new FormData();

  formData.append("images", image);

  return formData;
};

export const BenefitApi = rtkApi.injectEndpoints({
  endpoints: build => ({
    getBenefit: build.query<TBenefitData, number>({
      query: (id: number) => ({
        url: "/benefits/" + id,
      }),
      providesTags: ["Benefits"],
    }),
    getAllBenefit: build.query<TBenefitData[], null>({
      query: () => ({
        url: "/benefits/",
      }),
      providesTags: ["Benefits"],
    }),
    addBenefitImage: build.mutation<TBenefit, { id: number; image: File }>({
      query: (body: { id: number; image: File }) => ({
        method: "POST",
        url: `/benefits/${body.id}/images`,
        body: transform(body.image),
      }),
      invalidatesTags: ["Benefits"],
    }),
    createBenefit: build.mutation<TBenefitData, TBenefit>({
      query: (body: TBenefit) => ({
        method: "POST",
        url: "/benefits/",
        body: body,
      }),
      invalidatesTags: ["Benefits"],
    }),
    editBenefit: build.mutation<TBenefitData, { id: number } & TBenefit>({
      query: (body: { id: number } & TBenefit) => ({
        method: "PATCH",
        url: "/benefits/" + body.id,
        body: body,
      }),
      invalidatesTags: ["Benefits"],
    }),
  }),
});

export const {
  useCreateBenefitMutation,
  useGetAllBenefitQuery,
  useGetBenefitQuery,
  useAddBenefitImageMutation,
  useEditBenefitMutation,
} = BenefitApi;
