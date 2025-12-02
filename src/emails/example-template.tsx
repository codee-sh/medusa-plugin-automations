// import React from "react";
// import {
//   Text,
//   Container,
//   Heading,
//   Html,
//   Section,
//   Tailwind,
//   Head,
//   Preview,
//   Body,
//   Button,
// } from "@react-email/components";
// import type { TemplateData, TemplateOptionsType } from "@codee-sh/medusa-plugin-notification-emails/templates/emails";

// type EmailProps = {
//   data: TemplateData;
//   options: TemplateOptionsType;
// };

// function Template({ data, options }: EmailProps) {
//   return (
//     <Tailwind>
//       <Html className="font-sans bg-gray-100">
//         <Head />
//         <Preview>{`You've been invited to join ${data?.inventory_level?.location_id ?? ""}`}</Preview>
//         <Body className="bg-white my-10 mx-auto w-full max-w-2xl">
//           {/* Main Content */}
//           <Container className="p-6 text-center">
//             <Heading className="text-lg font-semibold text-black mb-6">
//               You've been invited to join {data?.inventory_level?.location_id ?? ""}
//             </Heading>

//             <Text className="text-sm text-black leading-relaxed mb-6">
//               Click the button below to accept the invitation and get started.
//             </Text>

//             <Section className="text-center my-8">
//               <Button
//                 href={data.inviteUrl}
//                 className="bg-black text-white py-3 px-8 inline-block"
//               >
//                 Accept invitation
//               </Button>
//             </Section>
//           </Container>

//           {/* Footer */}
//           <Section className="bg-gray-50 p-6 mt-10">
//             <Text className="text-center text-black text-xs mt-4">
//               © {new Date().getFullYear()}, Inc. All rights
//               reserved.
//             </Text>
//           </Section>
//         </Body>
//       </Html>
//     </Tailwind>
//   );
// }

// export default function getInviteTemplate(
//   data: TemplateData,
//   options: TemplateOptionsType
// ): React.ReactElement<any> {
//   return (
//     <Template
//       data={data}
//       options={options}
//     />
//   );
// }
