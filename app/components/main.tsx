import styled from 'styled-components';

type FlexProps = {
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  // Add any other props you want to define here
};

// export const Flex = styled.div<FlexProps>`
export const Flex = styled.div.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !['flexDirection', 'justifyContent', 'alignItems', 'flexWrap'].includes(prop),
})<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection || 'row'};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
  align-items: ${(props) => props.alignItems || 'stretch'};
  flex-wrap: ${(props) => props.flexWrap || 'nowrap'};
  /* Add any other default styles you want here */
`;

type MetricProps = {
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: string;
  // Add any other props you want to define here
};

export const Metric = styled.p<MetricProps>`
  font-weight: 600;
  color: #374151;
  text-align: ${(props) => props.textAlign || 'center'};
  font-size: ${(props) => props.fontSize || '1.25rem'};
  /* Add any other default styles you want here */

  /* Add dark mode styles if needed */
  @media (prefers-color-scheme: dark) {
    color: #f9fafb;
  }
`;

type TitleProps = {
  marginTop?: string;
  // Add any other props you want to define here
};

export const Title = styled.p<TitleProps>`
  font-weight: 500;
  color: #374151;
  margin-top: ${(props) => props.marginTop || '0rem'};
  /* Add any other default styles you want here */

  /* Add dark mode styles if needed */
  @media (prefers-color-scheme: dark) {
    color: #f9fafb;
  }
`;

export const Text = styled.p`
  color: #6b7280;
  /* Add any other default styles you want here */

  /* Add dark mode styles if needed */
  @media (prefers-color-scheme: dark) {
    color: #d1d5db;
  }
`;
